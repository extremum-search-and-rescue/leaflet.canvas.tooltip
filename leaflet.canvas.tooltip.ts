namespace L {
    export interface Evented {
        on(type: "gis:tooltip", fn: (event: L.Control.CanvasTooltipEvent) => void, context: L.Control.CanvasTooltip): Evented;
        fire(type: 'gis:tooltip', data: Control.CanvasTooltipEvent, propagate?: boolean): Evented;
    }
    export interface Map extends Evented {
        _controlContainer: HTMLDivElement
    }
    export interface MapOptions {
        canvasTooltip: boolean
    }

    export namespace Control { 
        export class CanvasTooltipOptions implements ControlOptions {
            timeout: number = 5000;
            position: ControlPosition = 'absolute';
        }
        export interface CanvasTooltipEvent {
            message: string
            sourceTarget: any;
            timeout: number;
            class: string;
            x: number
            y: number;
        }
        export class CanvasTooltip extends L.Control {
            override options: CanvasTooltipOptions;
            _map: L.Map;
            _prevTarget: any;
            _container: HTMLDivElement;
            timeoutID: number;
            constructor(options?: CanvasTooltipOptions) {
                options = options || new CanvasTooltipOptions();
                super(options);
                this.options = options;
            }

            override onAdd (map: L.Map) {
                this._map = map;

                this._container = L.DomUtil.create('div', 'leaflet-control-tooltip');
                map._controlContainer.appendChild(this._container);
                L.DomEvent.disableClickPropagation(this._container);
                this._map.on("gis:tooltip", this.show, this);
       
                return this._container;
            }

            show(this: CanvasTooltip, event: CanvasTooltipEvent) {
                if (!event.sourceTarget) return;
                var elem = this._container;
                elem.innerHTML = event.message;
                const messageClass = event.class;
                if (event.sourceTarget) {
                    if (this._prevTarget) {
                        if (this._prevTarget !== event.sourceTarget) {
                            L.DomEvent.off(this._prevTarget,'mouseout',this.hide, this);
                        }
                    }
                    L.DomEvent.on(event.sourceTarget,'mouseout', this.hide, this);
                    this._prevTarget = event.sourceTarget;
                }
                this.hide();

                if (messageClass) elem.classList.add(messageClass)

                L.DomEvent.on(this._map.getContainer(), 'mousemove',this._moveWithCursor, this);
                delete this._container.style.transform;
                elem.style.top = event.y + 16 + "px";
                elem.style.left = event.x + 24 + "px";
                elem.style.display = 'block';

                this.timeoutID = setTimeout(function() {
                    elem.style.display = 'none';
                    elem.classList.remove(messageClass);
                },
                    event.timeout || this.options.timeout);
            }
            hide() {
                if (typeof this.timeoutID == 'number') {
                    clearTimeout(this.timeoutID);
                }
                this._container.style.display = 'none';
                L.DomEvent.off(this._map.getContainer(), 'mousemove',this._moveWithCursor, this);
            }
            _moveWithCursor(this: CanvasTooltip, e: MouseEvent) {
                const size = this._container.getBoundingClientRect();

                let y = e.clientY;
                let x = e.clientX;
                let xModifier = 0;
                let yModifier = 8;
                let width = size.width;
                let height = size.height;

                const expectedRightSide = x + width;
                if (window.innerWidth < expectedRightSide) {
                    //too wide to fit screen to the right from cursor
                    if ((x - width) < 0) {
                        //too wide to fit screen to the left from cursor
                        if ((x + width) > window.innerWidth) { 

                            if ((width + 64) > window.innerHeight) {
                                // too wide to fit screen, cut width to fit
                                width = window.innerWidth - 64;
                                // start from left side
                                x = 32;
                            }                     
                            else
                            {
                                x = (window.innerWidth - width)/2;
                                width = window.innerWidth - 64;
                            }
                        }
                    }
                    else {
                        x = x - width;
                    }
                }
                else if(x<width/2)
                {
                    //cursor too left on screen, display tooltip to the right
                    xModifier = 8;
                }
                else {
                    //place tooltip centered to bottom of cursor
                    x = x - width/2;
                    yModifier = 24;
                }
                if(window.innerHeight<(y+yModifier+height+16))
                {
                    //tooltip too tall, move it above cursor
                    yModifier = -32;
                }
                this._container.style.top = `${y + yModifier}`;
                this._container.style.left = `${x + xModifier}`;
                this._container.style.maxWidth = `${width}px`;
            }
        }
    }

    L.Map.mergeOptions({
        canvasTooltip: false,
        canvasTooltipOptions: new Control.CanvasTooltipOptions()
    })

    L.Map.addInitHook(function () {
        if (this.options.canvasTooltip) {
            this.canvasTooltip = new Control.CanvasTooltip(this.canvastooltipOptions);
            this.addControl(this.canvasTooltip);
        }
    })
    export namespace control {
        export function canvasTooltip (options: L.Control.CanvasTooltipOptions) {
            return new Control.CanvasTooltip(options);
        }
    }
}
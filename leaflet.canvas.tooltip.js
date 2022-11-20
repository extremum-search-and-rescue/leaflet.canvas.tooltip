var L;
(function (L) {
    let Control;
    (function (Control) {
        class CanvasTooltipOptions {
            constructor() {
                this.timeout = 5000;
                this.position = 'absolute';
            }
        }
        Control.CanvasTooltipOptions = CanvasTooltipOptions;
        class CanvasTooltip extends L.Control {
            constructor(options) {
                options = options || new CanvasTooltipOptions();
                super(options);
                this.options = options;
            }
            onAdd(map) {
                this._map = map;
                this._container = L.DomUtil.create('div', 'leaflet-control-tooltip');
                map._controlContainer.appendChild(this._container);
                L.DomEvent.disableClickPropagation(this._container);
                this._map.on("gis:tooltip", this.show, this);
                return this._container;
            }
            show(event) {
                if (!event.sourceTarget)
                    return;
                var elem = this._container;
                elem.innerHTML = event.message;
                const messageClass = event.class;
                if (event.sourceTarget) {
                    if (this._prevTarget) {
                        if (this._prevTarget !== event.sourceTarget) {
                            L.DomEvent.off(this._prevTarget, 'mouseout', this.hide, this);
                        }
                    }
                    L.DomEvent.on(event.sourceTarget, 'mouseout', this.hide, this);
                    this._prevTarget = event.sourceTarget;
                }
                this.hide();
                if (messageClass)
                    elem.classList.add(messageClass);
                L.DomEvent.on(this._map.getContainer(), 'mousemove', this._moveWithCursor, this);
                delete this._container.style.transform;
                elem.style.top = event.y + 16 + "px";
                elem.style.left = event.x + 24 + "px";
                elem.style.display = 'block';
                this.timeoutID = setTimeout(function () {
                    elem.style.display = 'none';
                    elem.classList.remove(messageClass);
                }, event.timeout || this.options.timeout);
            }
            hide() {
                if (typeof this.timeoutID == 'number') {
                    clearTimeout(this.timeoutID);
                }
                this._container.style.display = 'none';
                L.DomEvent.off(this._map.getContainer(), 'mousemove', this._moveWithCursor, this);
            }
            _moveWithCursor(e) {
                const size = this._container.getBoundingClientRect();
                let y = e.clientY;
                let x = e.clientX;
                let xModifier = 0;
                let yModifier = 8;
                let width = size.width;
                let height = size.height;
                const expectedRightSide = x + width;
                if (window.innerWidth < expectedRightSide) {
                    if ((x - width) < 0) {
                        if ((x + width) > window.innerWidth) {
                            if ((width + 64) > window.innerHeight) {
                                width = window.innerWidth - 64;
                                x = 32;
                            }
                            else {
                                x = (window.innerWidth - width) / 2;
                                width = window.innerWidth - 64;
                            }
                        }
                    }
                    else {
                        x = x - width;
                    }
                }
                else if (x < width / 2) {
                    xModifier = 8;
                }
                else {
                    x = x - width / 2;
                    yModifier = 24;
                }
                if (window.innerHeight < (y + yModifier + height + 16)) {
                    yModifier = -32;
                }
                this._container.style.top = `${y + yModifier}`;
                this._container.style.left = `${x + xModifier}`;
                this._container.style.maxWidth = `${width}px`;
            }
        }
        Control.CanvasTooltip = CanvasTooltip;
    })(Control = L.Control || (L.Control = {}));
    L.Map.mergeOptions({
        canvasTooltip: false,
        canvasTooltipOptions: new Control.CanvasTooltipOptions()
    });
    L.Map.addInitHook(function () {
        if (this.options.canvasTooltip) {
            this.canvasTooltip = new Control.CanvasTooltip(this.canvastooltipOptions);
            this.addControl(this.canvasTooltip);
        }
    });
    let control;
    (function (control) {
        function canvasTooltip(options) {
            return new Control.CanvasTooltip(options);
        }
        control.canvasTooltip = canvasTooltip;
    })(control = L.control || (L.control = {}));
})(L || (L = {}));

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGVhZmxldC5jYW52YXMudG9vbHRpcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImxlYWZsZXQuY2FudmFzLnRvb2x0aXAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBVSxDQUFDLENBNkpWO0FBN0pELFdBQVUsQ0FBQztJQVlQLElBQWlCLE9BQU8sQ0ErSHZCO0lBL0hELFdBQWlCLE9BQU87UUFDcEIsTUFBYSxvQkFBb0I7WUFBakM7Z0JBQ0ksWUFBTyxHQUFXLElBQUksQ0FBQztnQkFDdkIsYUFBUSxHQUFvQixVQUFVLENBQUM7WUFDM0MsQ0FBQztTQUFBO1FBSFksNEJBQW9CLHVCQUdoQyxDQUFBO1FBU0QsTUFBYSxhQUFjLFNBQVEsQ0FBQyxDQUFDLE9BQU87WUFNeEMsWUFBWSxPQUE4QjtnQkFDdEMsT0FBTyxHQUFHLE9BQU8sSUFBSSxJQUFJLG9CQUFvQixFQUFFLENBQUM7Z0JBQ2hELEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDZixJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztZQUMzQixDQUFDO1lBRVEsS0FBSyxDQUFFLEdBQVU7Z0JBQ3RCLElBQUksQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFDO2dCQUVoQixJQUFJLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSx5QkFBeUIsQ0FBQyxDQUFDO2dCQUNyRSxHQUFHLENBQUMsaUJBQWlCLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztnQkFDbkQsQ0FBQyxDQUFDLFFBQVEsQ0FBQyx1QkFBdUIsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7Z0JBQ3BELElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUU3QyxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUM7WUFDM0IsQ0FBQztZQUVE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
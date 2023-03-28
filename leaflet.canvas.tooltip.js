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
                if (!event.message)
                    debugger;
                elem.innerHTML = event.message.replace(/(?:\r\n|\r|\n)/g, '<br>');
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
                this._setTooltipPosition(event.x, event.y);
                elem.style.visibility = 'visible';
                this.timeoutID = setTimeout(function () {
                    elem.style.visibility = 'hidden';
                    elem.classList.remove(messageClass);
                }, event.timeout || this.options.timeout);
            }
            hide() {
                if (typeof this.timeoutID == 'number') {
                    clearTimeout(this.timeoutID);
                }
                this._container.style.visibility = 'hidden';
                L.DomEvent.off(this._map.getContainer(), 'mousemove', this._moveWithCursor, this);
            }
            _setTooltipPosition(x, y) {
                const size = this._container.getBoundingClientRect();
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
                this._container.style.top = `${y + yModifier}px`;
                this._container.style.left = `${x + xModifier}px`;
                this._container.style.maxWidth = `${window.innerWidth - 64}px`;
            }
            _moveWithCursor(e) {
                let y = e.clientY;
                let x = e.clientX;
                this._setTooltipPosition(x, y);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGVhZmxldC5jYW52YXMudG9vbHRpcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImxlYWZsZXQuY2FudmFzLnRvb2x0aXAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBVSxDQUFDLENBNEpWO0FBNUpELFdBQVUsQ0FBQztJQVlQLElBQWlCLE9BQU8sQ0E4SHZCO0lBOUhELFdBQWlCLE9BQU87UUFDcEIsTUFBYSxvQkFBb0I7WUFBakM7Z0JBQ0ksWUFBTyxHQUFXLElBQUksQ0FBQztnQkFDdkIsYUFBUSxHQUFvQixVQUFVLENBQUM7WUFDM0MsQ0FBQztTQUFBO1FBSFksNEJBQW9CLHVCQUdoQyxDQUFBO1FBU0QsTUFBYSxhQUFjLFNBQVEsQ0FBQyxDQUFDLE9BQU87WUFNeEMsWUFBWSxPQUE4QjtnQkFDdEMsT0FBTyxHQUFHLE9BQU8sSUFBSSxJQUFJLG9CQUFvQixFQUFFLENBQUM7Z0JBQ2hELEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDZixJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztZQUMzQixDQUFDO1lBRVEsS0FBSyxDQUFFLEdBQVU7Z0JBQ3RCLElBQUksQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFDO2dCQUVoQixJQUFJLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSx5QkFBeUIsQ0FBQyxDQUFDO2dCQUNyRSxHQUFHLENBQUMsaUJBQWlCLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztnQkFDbkQsQ0FBQyxDQUFDLFFBQVEsQ0FBQyx1QkFBdUIsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7Z0JBQ3BELElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUM3QyxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUM7WUFDM0IsQ0FBQztZQUVE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
idangerous.swiper-2.5.1.js
line 1892:
        //Update Active Slide Index
        if (newPosition == 0 && action == 'reset' && !toOptions) {
        } else {
            _this.updateActiveSlide(newPosition);
        }

framework7.js
line 1711:
        //取反方向的panel
        var panel2 = $('.panel-' + (panelPosition == 'right' ? 'left' : 'right'));
        panel2.css({display: 'none'}).removeClass('active');
line 1769：
        app.side = "";
line 1778:
        app.side = app.params.swipePanel;
一下所有用 side 变量的地方都要换成 app.side
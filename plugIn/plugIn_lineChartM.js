(function (window) {
    /*
     * function { LineChart } 用于创建坐标轴
     * param{ ctx } 上下文
     * param{ points } 用于存取坐标的数组
     * param{ paddings } array距离画板的距离
     * param{ arrow } array三角形的大小
     *
     * */
    function LineChart(ctx, points, paddings, arrow) {
        this.ctx = ctx;
        this.points = points;
        //坐标轴两边的边距，用户传数据用用户的，用户不传用默认值
        paddings = paddings || [];
        this.paddingTop = paddings[0] || 10;
        this.paddingLeft = paddings[1] || 10;
        this.paddingBottom = paddings[2] || 10;
        this.paddingRight = paddings[3] || 10;

        //1、先找到左上角的顶点：s：竖线
        this.s = {
            x: this.paddingLeft,
            y: this.paddingTop
        }
        //2、找到坐标轴的原：o:原点
        this.o = {
            x: this.paddingLeft,
            y: this.ctx.canvas.height - this.paddingBottom
        }
        //3、找到右下角的顶点h:横线
        this.h = {
            x: this.ctx.canvas.width - this.paddingRight,
            y: this.ctx.canvas.height - this.paddingBottom
        }
        //画三角，三角的宽和高
        arrow = arrow || [];
        this.arrowWidth = arrow[0] || 10;
        this.arrowHeight = arrow[1] || 10;
        //调用等比例放大函数
        this.initPoint();
    }

    /*Coordinate的原型*/
    LineChart.prototype = {
        /*用于调用其他的函数*/
        draw: function () {
            this._drawLine();
            this._drawArrow();
            this._drawPoint();
            this._drawPerfline();
        },
        //坐标轴的线
        _drawLine: function () {
            this.ctx.beginPath();
            this.ctx.moveTo(this.s.x, this.s.y);
            this.ctx.lineTo(this.o.x, this.o.y);
            this.ctx.lineTo(this.h.x, this.h.y);
            this.ctx.stroke();
        },
        //坐标轴的角
        _drawArrow: function () {
            //上面箭头
            this.ctx.beginPath();
            this.ctx.moveTo(this.s.x, this.s.y);
            this.ctx.lineTo(this.s.x - this.arrowWidth / 2, this.s.y + this.arrowHeight);
            this.ctx.lineTo(this.s.x, this.s.y + this.arrowHeight / 2);
            this.ctx.lineTo(this.s.x + this.arrowWidth / 2, this.s.y + this.arrowHeight);
            this.ctx.closePath();
            //下面箭头
            this.ctx.moveTo(this.h.x, this.h.y);
            this.ctx.lineTo(this.h.x - this.arrowHeight, this.h.y - this.arrowWidth / 2);
            this.ctx.lineTo(this.h.x - this.arrowHeight / 2, this.h.y);
            this.ctx.lineTo(this.h.x - this.arrowHeight, this.h.y + this.arrowWidth / 2);
            this.ctx.closePath();
            this.ctx.stroke();
        },
        //等比例放大
        initPoint: function () {
            var self = this;
            var i = 0, len = this.points.length,
                pointsX = [], pointsY = [],
                coordMaxX, coordMaxY;
            //规定最大可以放得位置（坐标轴中默认显示的最大刻度）
            this.coordMaxX = this.ctx.canvas.width - this.paddingRight - this.arrowHeight - this.paddingLeft;
            this.coordMaxY = this.ctx.canvas.height - this.paddingTop - this.arrowHeight - this.paddingBottom;
            //找到点的最大的x和y
            //把x和y坐标分离开来，找到的是最大的x,y
            for (; i < len; i++) {
                if (i % 2 === 0) {
                    pointsX.push(this.points[i]);
                } else {
                    pointsY.push(this.points[i])
                }
            }
            //通过数组方式找最大（求出预期的坐标轴最大刻度）
            coordMaxX = Math.max.apply(null, pointsX);
            coordMaxY = Math.max.apply(null, pointsY);
            /*
             * 现在求出的最大刻度，是我们预想坐标轴可显示的最大刻度，
             * 实际上坐标轴显示的刻度，没有任何变化，
             * 我们需要使用坐标轴默认刻度/预期刻度得到一个比值，
             * 然后通过这个比值对原数据进行缩放
             * */
            this.points = this.points.map(function (val, index) {
                if (index % 2 === 0) {
                    return self.coordMaxX / coordMaxX * val;
                } else {
                    return self.coordMaxY / coordMaxY * val;
                }
            })
        },
        //画点
        _drawPoint: function () {
            for (var i = 0, len = this.points.length; i < len; i += 2) {
                //画点的样式
                // ctx.fillStyle = 'blue';
                this.ctx.fillRect(this.o.x + this.points[i], this.o.y - this.points[i + 1], 2, 2);
            }
        },
        //连线
        _drawPerfline: function () {
            this.ctx.beginPath();//在没有moveTo的时候，lineTo可以设置起始位置
            var self = this;
            for (var i = 0, len = this.points.length; i < len; i += 2) {
                self.ctx.lineTo(this.o.x + this.points[i], this.o.y - this.points[i + 1]);
                self.ctx.stroke();
            }
        }
    }


    /*在原型中扩展一个画折线图的插件*/
    jQuery.fn.extend({
        /*
         * function{ drawLineChart } 根据数据在第一个元素中展示折线图
         * param{ data }用户传送的数据
         * param{ paddings } 坐标轴距离画布最边的距离
         * param{ arrow } array三角形的大小
         *
         * 具体思路：
         *
         * */
        drawLineChart: function (data, paddings, arrow) {
            var $target, $targetWidth, $targetHeight,
                cav, ctx, line;
            // 1、获取第一个元素和第一个元素的宽和高(parseInt为了解决px问题)
            $target = this.first();
            $targetWidth = parseInt($target.css('width'));
            $targetHeight = parseInt($target.css('height'));
            // 2、画布初始化（利用jQuery创建一个canvas标签，并且设置cav的宽高和第一个元素的宽高一样）;
            cav = $('<canvas></canvas>').get(0);
            cav.width = $targetWidth;
            cav.height = $targetHeight;
            // 3、根据cav获取上下文
            ctx = cav.getContext('2d');
            // 4、在画布中绘制折线图
            line = new LineChart(ctx, data, paddings, arrow);
            line.draw();
            // 5、把绘制好的折线图展示在第一个元素中
            $target.append(cav);
        }
    })
}(window));






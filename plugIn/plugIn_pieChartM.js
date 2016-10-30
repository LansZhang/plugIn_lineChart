/**
 * Created by lanlan on 2016/10/15.
 */
(function (w) {
    /*
     * 1、创建一个构造函数：定义初始坐标、半径、数据
     * 2、给构造函数原型添加方法：绘制饼图
     *    2.1绘制饼图需要上传x轴坐标、y轴坐标、半径r、数据
     *    2.2数据是一个数组，要遍历
     *    2.3遍历出来的是数据，不是弧度：所以要把数据转换成弧度：
     *    1huDu=Math.PI/180*数据，那么度数=1huDu*1huDu
     * */
    /*
     * x:画饼图圆心的x轴坐标
     * y:画饼图圆心的y轴坐标
     * r:画饼图的半径
     * data:上传的数据
     * */
    function Pie(ctx, x, y, r, data) {
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.r = r;
        this.data = data;

        this.textSpace = 15;
        // 扇形的颜色
        this.colors = ['skyblue', 'deeppink', 'orange', 'yellow', 'red', 'green'];
        //求出1个数据对应的度数
        this.init();
    }

    //所以要把数据anle转换成弧度：1huDu=Math.PI/180*数据
    Pie.anleToRadius = function (angle) {
        return Math.PI / 180 * angle;
    }
    //改变函数Pie的原型
    Pie.prototype = {
        //将丢失的找回来
        constructor: Pie,
        //遍历数据:求出传的数据的总和
        init: function () {
            var num = 0;
            this.data.forEach(function (objdata) {
                num += objdata.val;
            })
            //1个数据对应的度数
            this.baseAngle = 360 / num;
        },
        //绘制饼图
        draw: function () {
            //定义开始画的度数，结束的位置
            var self = this;
            var startAngle = 0;
            var endAngle = 0;
            this.data.forEach(function (val, index) {
                //扇形的总角度
                var addAngle = self.baseAngle * self.data[index].val;
                //var ctx = self.ctx;
                self.ctx.beginPath();
                //最终的位置=上一个结束的位置+一个数据占得度数*data[index]
                endAngle = startAngle + addAngle;
                self.ctx.moveTo(self.x, self.y);
                self.ctx.arc(self.x, self.y, self.r, Pie.anleToRadius(startAngle), Pie.anleToRadius(endAngle));
                self.ctx.closePath();
                self.ctx.fillStyle = self.colors[index];
                self.ctx.fill();
                /*
                 * 在扇形中间画线
                 * 1、扇形中间的角度=扇形的起点角度+扇形的总角度/2；
                 * 2、扇形中间在圆上的坐标
                 * x坐标=圆心x坐标+半径*Math*cos(Pie.anleToRadius(扇形中间的角度))
                 * */
                self.ctx.beginPath();
                var tempAngle = startAngle + addAngle / 2;
                var tempX = self.x + (self.r + self.textSpace) * Math.cos(Pie.anleToRadius(tempAngle));
                var tempY = self.y + (self.r + self.textSpace) * Math.sin(Pie.anleToRadius(tempAngle));
                self.ctx.moveTo(self.x, self.y);
                self.ctx.lineTo(tempX, tempY);
                /*
                 * 绘制文字
                 * 有些文字不能显现出来，所以要调整textAlign
                 * */
                if (tempAngle > 90 && tempAngle < 270) {
                    self.ctx.textAlign = 'right';
                    self.ctx.lineTo(tempX - self.ctx.measureText(self.data[index].msg).width, tempY);
                } else {
                    self.ctx.textAlign = 'left';
                    self.ctx.lineTo(tempX + self.ctx.measureText(self.data[index].msg).width, tempY);
                }
                self.ctx.stroke();
                self.ctx.textBaseline = 'bottom';
                self.ctx.fillText(self.data[index].msg, tempX, tempY - 5);


                //下一个扇形的起点是这个扇形的终点
                startAngle = endAngle;
            });
        },
    }
    /*给原型扩展一个画饼图的插件*/
    $.fn.extend({
        /*
         * function{ drawPieChart }根据用户传的数据，画出一个饼图
         * param{ x } 画饼图圆心的 x 轴坐标
         * param{ y } 画饼图圆心的 y 轴坐标
         * param{ r } 画饼图的半径
         * data:上传的数据
         *
         * 具体思路：
         *
         *  4、将canvas添加到第一个元素的里面
         *
         * */
        drawPieChart: function (data, textSpace) {
            var $target, $targetWidth, $targetHeight,
                cav, ctx,
                x, y, r,
                textSpace = textSpace || 60;
            // 1、获得第一个元素，以及第一个元素的宽、高
            $target = this.first();
            $targetWidth = parseInt($target.css('width'));
            $targetHeight = parseInt($target.css('height'));
            // 2、利用jQuery动态创建一个canvas标签，并且将其的宽、高，设置成和第一个元素的宽高一样
            cav = $('<canvas></canvas>').get(0);
            cav.width = $targetWidth;
            cav.height = $targetHeight;
            ctx = cav.getContext('2d');
            // 3、根据宽高设置圆点、半径
            x = $targetWidth / 2;
            y = $targetHeight / 2;
            r = $targetWidth > $targetHeight ? ($targetHeight / 2 - textSpace) : ($targetWidth / 2 - textSpace);
            // 4、创建饼图，并绘制
            pie = new Pie(ctx, x, y, r, data);
            pie.draw();
            // 5、把canvas标记添加到第一个元素中，这样就可以在页面中浏览饼图了
            $target.append(cav);

        }
    });
})(window);
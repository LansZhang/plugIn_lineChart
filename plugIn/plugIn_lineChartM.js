(function (window) {
    /*
     * function { LineChart } ���ڴ���������
     * param{ ctx } ������
     * param{ points } ���ڴ�ȡ���������
     * param{ paddings } array���뻭��ľ���
     * param{ arrow } array�����εĴ�С
     *
     * */
    function LineChart(ctx, points, paddings, arrow) {
        this.ctx = ctx;
        this.points = points;
        //���������ߵı߾࣬�û����������û��ģ��û�������Ĭ��ֵ
        paddings = paddings || [];
        this.paddingTop = paddings[0] || 10;
        this.paddingLeft = paddings[1] || 10;
        this.paddingBottom = paddings[2] || 10;
        this.paddingRight = paddings[3] || 10;

        //1�����ҵ����ϽǵĶ��㣺s������
        this.s = {
            x: this.paddingLeft,
            y: this.paddingTop
        }
        //2���ҵ��������ԭ��o:ԭ��
        this.o = {
            x: this.paddingLeft,
            y: this.ctx.canvas.height - this.paddingBottom
        }
        //3���ҵ����½ǵĶ���h:����
        this.h = {
            x: this.ctx.canvas.width - this.paddingRight,
            y: this.ctx.canvas.height - this.paddingBottom
        }
        //�����ǣ����ǵĿ�͸�
        arrow = arrow || [];
        this.arrowWidth = arrow[0] || 10;
        this.arrowHeight = arrow[1] || 10;
        //���õȱ����Ŵ���
        this.initPoint();
    }

    /*Coordinate��ԭ��*/
    LineChart.prototype = {
        /*���ڵ��������ĺ���*/
        draw: function () {
            this._drawLine();
            this._drawArrow();
            this._drawPoint();
            this._drawPerfline();
        },
        //���������
        _drawLine: function () {
            this.ctx.beginPath();
            this.ctx.moveTo(this.s.x, this.s.y);
            this.ctx.lineTo(this.o.x, this.o.y);
            this.ctx.lineTo(this.h.x, this.h.y);
            this.ctx.stroke();
        },
        //������Ľ�
        _drawArrow: function () {
            //�����ͷ
            this.ctx.beginPath();
            this.ctx.moveTo(this.s.x, this.s.y);
            this.ctx.lineTo(this.s.x - this.arrowWidth / 2, this.s.y + this.arrowHeight);
            this.ctx.lineTo(this.s.x, this.s.y + this.arrowHeight / 2);
            this.ctx.lineTo(this.s.x + this.arrowWidth / 2, this.s.y + this.arrowHeight);
            this.ctx.closePath();
            //�����ͷ
            this.ctx.moveTo(this.h.x, this.h.y);
            this.ctx.lineTo(this.h.x - this.arrowHeight, this.h.y - this.arrowWidth / 2);
            this.ctx.lineTo(this.h.x - this.arrowHeight / 2, this.h.y);
            this.ctx.lineTo(this.h.x - this.arrowHeight, this.h.y + this.arrowWidth / 2);
            this.ctx.closePath();
            this.ctx.stroke();
        },
        //�ȱ����Ŵ�
        initPoint: function () {
            var self = this;
            var i = 0, len = this.points.length,
                pointsX = [], pointsY = [],
                coordMaxX, coordMaxY;
            //�涨�����Էŵ�λ�ã���������Ĭ����ʾ�����̶ȣ�
            this.coordMaxX = this.ctx.canvas.width - this.paddingRight - this.arrowHeight - this.paddingLeft;
            this.coordMaxY = this.ctx.canvas.height - this.paddingTop - this.arrowHeight - this.paddingBottom;
            //�ҵ��������x��y
            //��x��y������뿪�����ҵ���������x,y
            for (; i < len; i++) {
                if (i % 2 === 0) {
                    pointsX.push(this.points[i]);
                } else {
                    pointsY.push(this.points[i])
                }
            }
            //ͨ�����鷽ʽ��������Ԥ�ڵ����������̶ȣ�
            coordMaxX = Math.max.apply(null, pointsX);
            coordMaxY = Math.max.apply(null, pointsY);
            /*
             * ������������̶ȣ�������Ԥ�����������ʾ�����̶ȣ�
             * ʵ������������ʾ�Ŀ̶ȣ�û���κα仯��
             * ������Ҫʹ��������Ĭ�Ͽ̶�/Ԥ�ڿ̶ȵõ�һ����ֵ��
             * Ȼ��ͨ�������ֵ��ԭ���ݽ�������
             * */
            this.points = this.points.map(function (val, index) {
                if (index % 2 === 0) {
                    return self.coordMaxX / coordMaxX * val;
                } else {
                    return self.coordMaxY / coordMaxY * val;
                }
            })
        },
        //����
        _drawPoint: function () {
            for (var i = 0, len = this.points.length; i < len; i += 2) {
                //�������ʽ
                // ctx.fillStyle = 'blue';
                this.ctx.fillRect(this.o.x + this.points[i], this.o.y - this.points[i + 1], 2, 2);
            }
        },
        //����
        _drawPerfline: function () {
            this.ctx.beginPath();//��û��moveTo��ʱ��lineTo����������ʼλ��
            var self = this;
            for (var i = 0, len = this.points.length; i < len; i += 2) {
                self.ctx.lineTo(this.o.x + this.points[i], this.o.y - this.points[i + 1]);
                self.ctx.stroke();
            }
        }
    }


    /*��ԭ������չһ��������ͼ�Ĳ��*/
    jQuery.fn.extend({
        /*
         * function{ drawLineChart } ���������ڵ�һ��Ԫ����չʾ����ͼ
         * param{ data }�û����͵�����
         * param{ paddings } ��������뻭����ߵľ���
         * param{ arrow } array�����εĴ�С
         *
         * ����˼·��
         *
         * */
        drawLineChart: function (data, paddings, arrow) {
            var $target, $targetWidth, $targetHeight,
                cav, ctx, line;
            // 1����ȡ��һ��Ԫ�غ͵�һ��Ԫ�صĿ�͸�(parseIntΪ�˽��px����)
            $target = this.first();
            $targetWidth = parseInt($target.css('width'));
            $targetHeight = parseInt($target.css('height'));
            // 2��������ʼ��������jQuery����һ��canvas��ǩ����������cav�Ŀ�ߺ͵�һ��Ԫ�صĿ��һ����;
            cav = $('<canvas></canvas>').get(0);
            cav.width = $targetWidth;
            cav.height = $targetHeight;
            // 3������cav��ȡ������
            ctx = cav.getContext('2d');
            // 4���ڻ����л�������ͼ
            line = new LineChart(ctx, data, paddings, arrow);
            line.draw();
            // 5���ѻ��ƺõ�����ͼչʾ�ڵ�һ��Ԫ����
            $target.append(cav);
        }
    })
}(window));






<template>
    <div class="adai_fire_wrap" :class="{hide:isHide}">
        <canvas id="adai_canvas"></canvas>
    </div>
</template>
<script>
import { mapState, mapActions, mapGetters } from "vuex";
export default {
    name: "adaiFireAnimate",
    props:{
        
    },
    data: () => {
        return {
            isHide:false,
        };
    },
    created:function(){
       
    },
    mounted:function(){
        this.init(300);
    },
    beforeDestroy(){
        this.timer = null;
    },
    methods:{
        init(n){
            let canvas = document.getElementById("adai_canvas");
            let context = canvas.getContext("2d");
            let width = canvas.width = window.innerWidth;
            let height = canvas.height = window.innerHeight;
            let particle = [];
            let particleCount = 0,
                gravity = 0.3,
                colors = [
                    '#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5',
                    '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4CAF50',
                    '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800',
                    '#FF5722', '#795548'
                ];
            let w = window.innerWidth,x=1175;
            if(w >= 1050 && w < 1366){
                x = 873;
            }
            function randomRange(min, max) {
                return min + Math.random() * (max - min);
            }
            for (var i = 0; i < n; i++) {
                particle.push({
                    x: x,
                    y: 340,
                    boxW: randomRange(5, 20),
                    boxH: randomRange(5, 20),
                    size: randomRange(2, 8),
                    spikeran: randomRange(3, 5),
                    velX: randomRange(-8, 8),
                    velY: randomRange(-50, -10),
                    angle: this.convertToRadians(randomRange(0, 360)),
                    color: colors[Math.floor(Math.random() * colors.length)],
                    anglespin: randomRange(-0.2, 0.2),
                    draw: function() {
                        context.save();
                        context.translate(this.x, this.y);
                        context.rotate(this.angle);
                        context.fillStyle = this.color;
                        context.beginPath();
                        // drawStar(0, 0, 5, this.boxW, this.boxH);
                        context.fillRect(this.boxW / 2 * -1, this.boxH / 2 * -1, this.boxW, this.boxH);
                        context.fill();
                        context.closePath();
                        context.restore();
                        this.angle += this.anglespin;
                        this.velY *= 0.999;
                        this.velY += 0.3;

                        this.x += this.velX;
                        this.y += this.velY;
                        if (this.y < 0) {
                            this.velY *= -0.2;
                            this.velX *= 0.9;
                        };
                        if (this.y > height) {
                            this.anglespin = 0;
                            this.y = height;
                            this.velY *= -0.2;
                            this.velX *= 0.9;
                        };
                        if (this.x > width || this.x < 0) {

                            this.velX *= -0.5;
                        };
                    },
                });
            }
            this.width = width;
            this.height = height;
            this.context = context;
            this.particle = particle;

            // this.update();
            let timer = setInterval(() => {
                this.update();
            }, 20);
            setTimeout(() => {
                clearTimeout(timer);
                // cancelAnimationFrame(this.timer);
                this.isHide = true;
            }, 5000);
        },
        drawScreen(){
            for (var i = 0; i < this.particle.length; i++) {
                this.particle[i].draw();
            }
        },
        update() {
            this.context.clearRect(0, 0, this.width, this.height);
            this.drawScreen();
            // console.log(1);
            // this.timer = requestAnimationFrame(this.update());
        },
        randomRange(min, max) {
            return min + Math.random() * (max - min);
        },
        convertToRadians(degree) {
            return degree * (Math.PI / 180);
        },
        randomInt(min, max) {
            return Math.floor(min + Math.random() * (max - min + 1));
        },
        drawStar(cx, cy, spikes, outerRadius, innerRadius, color) {
            var rot = Math.PI / 2 * 3;
            var x = cx;
            var y = cy;
            var step = Math.PI / spikes;

            this.context.strokeSyle = "#000";
            this.context.beginPath();
            this.context.moveTo(cx, cy - outerRadius)
            for (i = 0; i < spikes; i++) {
                x = cx + Math.cos(rot) * outerRadius;
                y = cy + Math.sin(rot) * outerRadius;
                this.context.lineTo(x, y)
                rot += step

                x = cx + Math.cos(rot) * innerRadius;
                y = cy + Math.sin(rot) * innerRadius;
                this.context.lineTo(x, y)
                rot += step
            }
            this.context.lineTo(cx, cy - outerRadius)
            this.context.closePath();
            this.context.fillStyle = color;
            this.context.fill();
        },
    },
};
</script>
<style scoped lang="scss">
.adai_fire_wrap{
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 10;
    &.hide{
        // display: none;
        z-index: -1;
    }
    canvas{
        width: 100%;
        height: 100%;
        display: block;
        border: none;
    }
}
</style>
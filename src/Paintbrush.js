class Brush {
    constructor(position,sizeShape,colorShape,segments) {  // apolocheese for naming conventions
        this.type = 'brush';
        this.pos = position;
        this.size = sizeShape;
        this.color = colorShape;
        this.segs = segments;
    }

    render() {
        let pos = [this.pos[0],this.pos[1]];
        let size = this.size;
        let d = this.size/200;

        // main circle
        drawCircle(pos,size,this.color,this.segs);
        // detail
        size = this.size * .25;
        drawCircle([pos[0],pos[1]+d],size,this.color,this.segs);
        size = this.size * .15;
        arc([pos[0]+d*2/3,pos[1]],size,this.color,this.segs,Math.PI*3/4,Math.PI,d*3/2);
        size = this.size * .45;
        drawCircle([pos[0]-d*2/3,pos[1]-d*2/3],size,this.color,this.segs);
        size = this.size * .25;
        arc([pos[0]-d,pos[1]+d/2],size,this.color,this.segs,-Math.PI*1/4,0,d*2);
    }
}

function arc(center, stroke_size, color, segments, start_ang, end_ang, radius) {
    const step_size = radius*Math.abs((end_ang-start_ang)/stroke_size/2);
    for (let ang = start_ang; ang <= end_ang; ang += step_size) {
        let x = center[0] + Math.cos(ang) * radius;
        let y = center[1] + Math.sin(ang) * radius;

        drawCircle([x, y], stroke_size, color, segments);
    }
}

//
// 11.3.19
// Online Terrain Emulation
//

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

class Drop {

    constructor(posX, posY) {
        this.position = [posX, posY];
        this.momentum = .2;
        this.moveCap = 100;
        this.erosionRate = .9;
        this.depositionRate = .1;
        this.erosionRadius = 4;
        this.minCapacity = .01
    }
}
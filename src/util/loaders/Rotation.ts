class Rotation {

    private readonly rotationX: number;
    private readonly rotationY: number;
    private readonly rotationZ: number;

    constructor(
        rotationX: number,
        rotationY: number,
        rotationZ: number
    ) {
        this.rotationX = this.convertDegreesToRadians( rotationX );
        this.rotationY = this.convertDegreesToRadians( rotationY );
        this.rotationZ = this.convertDegreesToRadians( rotationZ );
    }

    getXRotation() {
        return this.rotationX;
    }

    getYRotation() {
        return this.rotationY;
    }

    getZRotation() {
        return this.rotationZ;
    }

    private convertDegreesToRadians( degrees: number ) {
        return ( degrees * Math.PI ) / 2;
    }
}

export { Rotation };
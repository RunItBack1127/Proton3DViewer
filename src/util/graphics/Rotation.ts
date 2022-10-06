const CONVERT_DEGREES_TO_RADIANS = ( degrees: number ) => {
    return degrees * ( Math.PI / 180 );
}

class Rotation {

    private readonly _rotation_x: number;
    private readonly _rotation_y: number;
    private readonly _rotation_z: number;

    constructor( x: number, y: number, z: number ) {
        this._rotation_x = CONVERT_DEGREES_TO_RADIANS( x );
        this._rotation_y = CONVERT_DEGREES_TO_RADIANS( y );
        this._rotation_z = CONVERT_DEGREES_TO_RADIANS( z );
    }

    getX(): number {
        return this._rotation_x;
    }

    getY(): number {
        return this._rotation_y;
    }

    getZ(): number {
        return this._rotation_z;
    }
}

export { Rotation };
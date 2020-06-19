if (typeof DataView === 'undefined') {

    DataView = function (buffer, byteOffset) {
        this.buffer = buffer;
        this.byteOffset = byteOffset || 0;
        this.byteLength = buffer.byteLength || buffer.length;
        this._isString = typeof buffer === "string";
    }

    DataView.prototype = {

        _getCharCodes: function (buffer, start, length) {
            start = start || 0;
            length = length || buffer.length;
            var end = start + length;
            var codes = [];
            for (var i = start; i < end; i++) {
                codes.push(buffer.charCodeAt(i) & 0xff);
            }
            return codes;
        },

        _getBytes: function (length, byteOffset, littleEndian) {

            var result;

            // Handle the lack of endianness
            if (littleEndian === undefined) {
                littleEndian = this._littleEndian;
            }

            // Handle the lack of byteOffset
            if (byteOffset === undefined) {
                byteOffset = this.byteOffset;
            } else {
                byteOffset = this.byteOffset + byteOffset;
            }

            if (length === undefined) {
                length = this.byteLength - byteOffset;
            }

            // Error Checking
            if (typeof byteOffset !== 'number') {
                throw new TypeError('DataView byteOffset is not a number');
            }

            if (length < 0 || byteOffset + length > this.byteLength) {
                throw new Error('DataView length or (byteOffset+length) value is out of bounds');
            }

            if (this.isString) {
                result = this._getCharCodes(this.buffer, byteOffset, byteOffset + length);
            } else {
                result = this.buffer.slice(byteOffset, byteOffset + length);
            }

            if (!littleEndian && length > 1) {
                if (!(result instanceof Array)) {
                    result = Array.prototype.slice.call(result);
                }

                result.reverse();
            }
            return result;
        },

        // Compatibility functions on a String Buffer

        getFloat64: function (byteOffset, littleEndian) {
            var b = this._getBytes(8, byteOffset, littleEndian),
                sign = 1 - (2 * (b[7] >> 7)),
                exponent = ((((b[7] << 1) & 0xff) << 3) | (b[6] >> 4)) - ((1 << 10) - 1),
                // Binary operators such as | and << operate on 32 bit values, using + and Math.pow(2) instead
                mantissa = ((b[6] & 0x0f) * Math.pow(2, 48)) + (b[5] * Math.pow(2, 40)) + (b[4] * Math.pow(2, 32)) +
                    (b[3] * Math.pow(2, 24)) + (b[2] * Math.pow(2, 16)) + (b[1] * Math.pow(2, 8)) + b[0];

            if (exponent === 1024) {
                if (mantissa !== 0) {
                    return NaN;
                } else {
                    return sign * Infinity;
                }
            }
            if (exponent === -1023) { // Denormalized
                return sign * mantissa * Math.pow(2, -1022 - 52);
            }
            return sign * (1 + mantissa * Math.pow(2, -52)) * Math.pow(2, exponent);
        },

        getFloat32: function (byteOffset, littleEndian) {
            var b = this._getBytes(4, byteOffset, littleEndian),

                sign = 1 - (2 * (b[3] >> 7)),
                exponent = (((b[3] << 1) & 0xff) | (b[2] >> 7)) - 127,
                mantissa = ((b[2] & 0x7f) << 16) | (b[1] << 8) | b[0];

            if (exponent === 128) {
                if (mantissa !== 0) {
                    return NaN;
                } else {
                    return sign * Infinity;
                }
            }

            if (exponent === -127) { // Denormalized
                return sign * mantissa * Math.pow(2, -126 - 23);
            }

            return sign * (1 + mantissa * Math.pow(2, -23)) * Math.pow(2, exponent);
        },

        getInt32: function (byteOffset, littleEndian) {
            var b = this._getBytes(4, byteOffset, littleEndian);
            return (b[3] << 24) | (b[2] << 16) | (b[1] << 8) | b[0];
        },

        getUint32: function (byteOffset, littleEndian) {
            return this.getInt32(byteOffset, littleEndian) >>> 0;
        },

        getInt16: function (byteOffset, littleEndian) {
            return (this.getUint16(byteOffset, littleEndian) << 16) >> 16;
        },

        getUint16: function (byteOffset, littleEndian) {
            var b = this._getBytes(2, byteOffset, littleEndian);
            return (b[1] << 8) | b[0];
        },

        getInt8: function (byteOffset) {
            return (this.getUint8(byteOffset) << 24) >> 24;
        },

        getUint8: function (byteOffset) {
            return this._getBytes(1, byteOffset)[0];
        },

    };
}

MakerJS.StreamReader = function (buffer, byteOffset, byteLength) {
    this.cursor = 0;
    this.reader = new DataView(buffer, byteOffset);
}

MakerJS.StreamReader.prototype = {

    constructor: MakerJS.StreamReader,

    // Little Endian
    readDouble: function () {
        var pos = this.cursor; this.cursor += 8;
        return this.reader.getFloat64(pos, true);
    },
    readFloat: function () {
        var pos = this.cursor; this.cursor += 4;
        return this.reader.getFloat32(pos, true);
    },
    readInt: function () {
        var pos = this.cursor; this.cursor += 4;
        return this.reader.getInt32(pos, true);
    },
    readUInt: function () {
        var pos = this.cursor; this.cursor += 4;
        return this.reader.getUint32(pos, true);
    },
    readShort: function () {
        var pos = this.cursor; this.cursor += 2;
        return this.reader.getInt16(pos, true);
    },
    readUShort: function () {
        var pos = this.cursor; this.cursor += 2;
        return this.reader.getUint16(pos, true);
    },
    readChar: function () {
        var pos = this.cursor; this.cursor += 1;
        return this.reader.getInt8(pos, true);
    },
    readUChar: function () {
        var pos = this.cursor; this.cursor += 1;
        return this.reader.getUint8(pos, true);
    },
    readInt2: function () {
        var ret = this.readChar();
        var sign = ret & 0x40;
        if ((ret & 0x00000080) == 0) { ret &= 0x3f; if (sign) return -ret; return ret; }
        ret = (ret & 0x0000003f) | (this.readChar() << 6);
        if ((ret & 0x00002000) == 0) { if (sign) return -ret; return ret; }
        ret = (ret & 0x00001fff) | (this.readChar() << 13);
        if ((ret & 0x00100000) == 0) { if (sign) return -ret; return ret; }
        ret = (ret & 0x000fffff) | (this.readChar() << 20);
        if ((ret & 0x08000000) == 0) { if (sign) return -ret; return ret; }
        ret = (ret & 0x07ffffff) | (this.readChar() << 27);
        if (sign) return -ret;
        return ret;
    },
    readFloatArray: function (l) {
        var array = new Float32Array(l);
        for (var i = 0; i < l; i++) {
            array[i] = this.readFloat();
        };
        return array;
    },
    readIntArray: function (l) {
        var array = new Int32Array(l);
        for (var i = 0; i < l; i++) {
            array[i] = this.readInt();
        };
        return array;
    },
    readUIntArray: function (l) {
        var array = new Uint32Array(l);
        for (var i = 0; i < l; i++) {
            array[i] = this.readUInt();
        };
        return array;
    },
    readShortArray: function (l) {
        var array = new Int32Array(l);
        for (var i = 0; i < l; i++) {
            array[i] = this.readShort();
        };
        return array;
    },
    readUShortArray: function (l) {
        var array = new Uint32Array(l);
        for (var i = 0; i < l; i++) {
            array[i] = this.readUShort();
        };
        return array;
    },
    readCharArray: function (l) {
        var array = new Int32Array(l);
        for (var i = 0; i < l; i++) {
            array[i] = this.readChar();
        };
        return array;
    },
    readUCharArray: function (l) {
        var array = new Uint32Array(l);
        for (var i = 0; i < l; i++) {
            array[i] = this.readUChar();
        };
        return array;
    },
    readVector3: function () {
        var array = this.readFloatArray(3);
        return (new THREE.Vector3(array[0], array[1], array[2]));
    },
    readVector4: function () {
        var array = this.readFloatArray(4);
        return (new THREE.Vector4(array[0], array[1], array[2], array[3]));
    },
    readString: function () {
        var length = this.readInt();
        // 暂未实现
        this.cursor += length;
    },
    readString2: function () {
        var length = this.readInt2();
        // 暂未实现
        this.cursor += length;
    },
    seekCur: function (offset) {
        this.cursor += offset;
    },
}

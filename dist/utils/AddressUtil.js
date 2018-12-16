"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAddress = (latitude, longitude, radius) => {
    let kmInLongitudeDegree = 111.320 * Math.cos(latitude / 180.0 * Math.PI);
    let deltaLat = radius / 111.1;
    let deltaLong = radius / kmInLongitudeDegree;
    let minLat = latitude - deltaLat;
    let maxLat = latitude + deltaLat;
    let minLong = longitude - deltaLong;
    let maxLong = longitude + deltaLong;
    let address = [minLat, maxLat, minLong, maxLong];
    return address;
};
//# sourceMappingURL=AddressUtil.js.map
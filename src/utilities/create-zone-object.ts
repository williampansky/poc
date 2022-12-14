import { v4 as uuid } from 'uuid';
import { Zone, ZoneBase } from '../interfaces';

/**
 * Creates a `Zone` object from the provided zone base info. Can
 * be create with or without a uuid() via the second param.
 */
const createZoneObject = (obj: ZoneBase, withUuid: boolean = false): Zone => {
  return {
    disabled: {
      '0': false,
      '1': false,
    },
    id: obj.id,
    name: obj.name,
    powers: {
      '0': 0,
      '1': 0,
    },
    powerAdjustment: obj?.powerAdjustment,
    powerText: obj?.powerText,
    revealed: false,
    sides: {
      '0': [],
      '1': [],
    },
    uuid: withUuid ? uuid() : '',
  } as Zone;
};

export default createZoneObject;

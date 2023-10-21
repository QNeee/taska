import L from 'leaflet';
import { ICustomMarker } from '../../src/Mufts';
import { TestsHelper } from '../../src/tests/TestsHelper'
describe('make Muft and check LatLng', () => {
    const muft = TestsHelper.generateMuft() as ICustomMarker
    it('make Muft', () => {
        expect(typeof muft === 'object').toBe(true);
    })
    it('check Muft Instance', () => {
        expect(muft).toBeInstanceOf(L.Marker);
    })
})
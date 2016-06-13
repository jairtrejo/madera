import LocalStorageResource from './resources/LocalStorage';
import { replaceStateReducer } from '../common/reducers';

export default {
    resources: [LocalStorageResource],
    reducers: [replaceStateReducer]
}

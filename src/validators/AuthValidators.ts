import {vendorPayload} from "./VendorValidators";
import {customerPayload} from "./CustomerValidator";

export type AuthPayload=vendorPayload|customerPayload;
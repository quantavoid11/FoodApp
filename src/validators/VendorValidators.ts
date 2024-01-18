export interface createVednorInput{
    name:string,
    address:string,
    pincode:string,
    foodType:[string],
    email:string,
    password:string,
    ownerName:string,
    phone:string
}

export interface loginVendorInput{
    email:string,
    password:string
}
export interface vendorPayload{
    _id:string,
    name:string,
    email:string
}
export interface updateVendorInput{
    foodType:[string],
    name:string,
    address:string,
    phone:string,
    pincode:string,
    ownerName:string
}

export interface updateServiceInput{
    latitude:number,
    longitude:number
}
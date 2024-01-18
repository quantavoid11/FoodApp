
class ApiResponse{
    private statusCode: number;
    private data: any;
    private message: string;
    private success: boolean;
    constructor(
        statusCode:number,
        data:any,
        message="Success"
    ) {

        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = statusCode < 400;
    }
}
export {ApiResponse};
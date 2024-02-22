export class CoupomUnvailable extends Error{
    constructor(){
        super();
        this.message = "coupom unvailable"
    }

}
import {makeAutoObservable} from "mobx";


export default class UserStore {
    isAuth = false;
    constructor(){

        this._user = {
            name: null,
        };
        makeAutoObservable(this)
    }

    setIsAuth(bool){
        this.isAuth = bool;
    }

    setUser(user){
        this._user = user;
    }

    get user(){
        return this._user;
    }

}
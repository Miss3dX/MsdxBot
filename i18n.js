class i18n_handler {
    constructor(string){
        this.string = string;
    }
    set(what, replacer){
        this.string = this.string.replace(new RegExp(`{{${what}}}`, "gi"), replacer);
        return this;
    }
    stringify(){
        return this.string;
    }
}

module.exports = class i18n {
    constructor(data){
        this.data = data;
        this._ = require("lodash/object");
    }
    get(language, path){
        return new i18n_handler(this._.get(this.data[language], path));
    }
}
class service {
    constructor(name) {
        this.name = name;
    }
    help(){
        return ["this is the help message of the service", this.name];
    }
    on(cmd){
        return ["Service " + this.name + " called with this command:", cmd];
    }
}

class helpService extends service {
    constructor(name) {
        super(name);
    }
    on(cmd) {
        return [
            "<br>",
            '<span class="inherit">Command <span class="command">\'' + cmd + '\'</span> not found. Here is a list of all commands:</span>',
            "<br>",
            '<span class="command">help</span>           You obviously already know what this does (if not, i\'ll explain it: it shows you this list you idiot)',
            '<span class="command">clear</span>          Clear terminal',
            '<span class="command">banner</span>         Display the header',
            "<br>",
        ];
    }
    static help(){
        return [
            "<br>",
            '<span class="command">help</span>           You obviously already know what this does (if not, i\'ll explain it: it shows you this list you idiot)',
            '<span class="command">clear</span>          Clear terminal',
            '<span class="command">banner</span>         Display the header',
            "<br>",
        ];
    }
}
class welcomeService extends service {
    constructor(name) {
        super(name);
    }
    banner(){
        return [
            "   _______   _                  _____           _              _   _                               _      _ ",
            "  |__   __| (_)                / ____|         | |            (_) | |                             | |    (_)",
            "     | |     _   _ __ ___     | |  __    __ _  | |__    _ __   _  | | __   ___   __      __  ___  | | __  _ ",
            "     | |    | | | '_ ` _ \\    | | |_ |  / _` | | '_ \\  | '__| | | | |/ /  / _ \\  \\ \\ /\\ / / / __| | |/ / | |",
            "     | |    | | | | | | | |   | |__| | | (_| | | |_) | | |    | | |   <  | (_) |  \\ V  V /  \\__ \\ |   <  | |",
            "     |_|    |_| |_| |_| |_|    \\_____|  \\__,_| |_.__/  |_|    |_| |_|\\_\\  \\___/    \\_/\\_/   |___/ |_|\\_\\ |_|",
            "",
            '<span class="color2">Welcome to my interactive web terminal.</span>',
            '<span class="color2">For a list of available commands, type</span> <span class="command">\'help\'</span><span class="color2">.</span>',
        ]
    }
}

class securityService extends service {
    constructor(name) {
        super(name);
    }
    on(cmd){
        console.log(cmd);
    }
    isRoot = false;
    username = "";
    async checkLogin(pwd) {
        if (pwd == "timo") {
            console.log("really?")
             this.isRoot = true;
             return true;
        } else {
            return false;
        }
    }
    logout(){
        this.isRoot = false;
    }
}
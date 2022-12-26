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
        if(cmd.startsWith("-help")) return {loginProcess: false, msg: this.help(), style: "white"};
        if(cmd.length < 4) return {loginProcess: false, msg: this.help(), style: "white"};
        this.username = cmd.substring(3, cmd.length)

        return {loginProcess: true, msg: ["Username: " + this.username], style: ""};
    }
    help(){
        return [
            "Syntax:  login [OPTIONS]",
            "  OPTIONS:",
            "    -help               Display this help text",
            "    -u [USERNAME]       Set username to login",
        ]
    }
    isRoot = false;
    username = "";
    async checkLogin(pwd) {
        var response = await fetch("https://id.gabrikowski.de/login", {
            method: 'POST', // or 'PUT'
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({username: this.username, password: pwd}),
        })
        if (response.ok) {
             this.isRoot = true;
             var data = await response.json();
             var newAuthService = new authService(data.token);
             tokenVault = newAuthService;
             return true;
        } else {
            return false;
        }
    }
    logout(){
        this.isRoot = false;
    }
}

class authService {
    constructor(token) {
        this.accessToken = token;
    }
    addAuthHeader(headers){
        headers.append('Authorization', 'GID ' + this.accessToken);
        return headers;
    }
}
tokenVault = new authService("none");

class blogService extends service{
    constructor(name) {
        super(name);
    }

    async getList(){
        var headers = new Headers();
        headers.append("content-type", "application/json")
        var resonse = await fetch(API_HOST + "/blog/entries", {
            method: "GET",
            headers: tokenVault.addAuthHeader(headers),
        })
        return await resonse.json();
    }

}

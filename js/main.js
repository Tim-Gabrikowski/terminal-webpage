var before = document.getElementById("before");
var liner = document.getElementById("liner");
var command = document.getElementById("typer");
var textarea = document.getElementById("texter");
var terminal = document.getElementById("terminal");
var loadingSpinner = document.getElementById("spinner")

var git = 0;
var pw = false;
let pwd = false;
var commands = [];

setTimeout(function () {
	loopLines(welcomeservice.banner(), "", 80);
	textarea.focus();
	liner.setAttribute(
		"data-before",
		`${securityservice.isRoot ? "root" : "visitor"}@tim.gabrikowski.de:~$`
	);
}, 100);

window.addEventListener("keyup", enterKey);

//init
textarea.value = "";
command.innerHTML = textarea.value;

let securityservice = new securityService("security");

async function enterKey(e) {
	if (e.keyCode == 181) {
		document.location.reload(true);
	}

	if (pw) {
		// command.classList.add("blurrText");
		let et = "*";
		let w = textarea.value.length;
		command.innerHTML = et.repeat(w);
		var pword = textarea.value.toString().replace(/(\r\n|\n|\r)/gm, "");
		if(e.keyCode == 13){
			if (await securityservice.checkLogin(pword)) {
				loopLines(["access granted"], "color2 margin", 120);
				command.innerHTML = "";
				textarea.value = "";
				pw = false;
				liner.setAttribute(
					"data-before",
					`${securityservice.isRoot ? "root" : "visitor"}@tim.gabrikowski.de:~$`
				);
				liner.classList.remove("password");
			} else {
				addLine("Wrong password", "error", 0);
				command.innerHTML = "";
				textarea.value = "";
				pw = false;
				liner.classList.remove("password");
			}
		}
	} else {
		command.classList.remove("blurrText");
		if (e.keyCode == 13) {
			commands.push(command.innerHTML);
			git = commands.length;
			addLine(
				`${securityservice.isRoot ? "root" : "visitor"}@tim.gabrikowski.de:~$ ${
					command.innerHTML
				}`,
				"no-animation",
				0
			);
			commander(command.innerHTML.toLowerCase());
			liner.setAttribute(
				"data-before",
				`${securityservice.isRoot ? "root" : "visitor"}@tim.gabrikowski.de:~$`
			);
			command.innerHTML = "";
			textarea.value = "";
		}

		// prev inputs
		if (e.keyCode == 38 && git != 0) {
			git -= 1;
			textarea.value = commands[git];
			command.innerHTML = textarea.value;
		}
		if (e.keyCode == 40 && git != commands.length) {
			git += 1;
			if (commands[git] === undefined) {
				textarea.value = "";
			} else {
				textarea.value = commands[git];
			}
			command.innerHTML = textarea.value;
		}
	}
}

let defaultservice = new service("default");
let helpservice = new helpService("help");
let welcomeservice = new welcomeService("welcome");

function commander(cmd) {
	// DEFINE COMMANDS HERE

	switch (cmd.toLowerCase()) {
		// help
		case "help":
			loopLines(helpService.help(), "color2 margin", 80);
			break;

		//login
		case cmd.startsWith("login") ? cmd : "" :
			if (!securityservice.isRoot) {
				securityservice.on(cmd.substring(6, cmd.length));
				liner.classList.add("password");
				pw = true;
			} else {
				addLine("Already logged in", "", 0);
			}
			break;

		// history
		case "history":
			addLine("<br>", "", 0);
			loopLines(commands, "color2", 80);
			addLine("<br>", "command", 80 * commands.length + 50);
			break;

		case cmd.startsWith("sudo") ? cmd : "" :
			if(!securityservice.isRoot) {
				loopLines(["You need to login for this"], "error", 80);
			} else {
				loopLines(["ok"], "", 80)
			}
			break;

		// banner
		case "banner":
			loopLines(welcomeservice.banner(), "", 80);
			break;

		// clear
		case "clear":
			setTimeout(function () {
				terminal.innerHTML = '<a id="before"></a>';
				before = document.getElementById("before");
			}, 1);
			break;

		// service-test
		case "service":
			var lines = defaultservice.on(cmd);
			loopLines(lines, "white", 80);
			break;

		// default
		default:
			loopLines(
				helpservice.on(cmd),
				"error margin",
				80
			);
			break;
	}
}

function newTab(link) {
	setTimeout(function () {
		window.open(link, "_blank");
	}, 500);
}

function addLine(text, style, time) {
	var t = "";
	for (let i = 0; i < text.length; i++) {
		if (text.charAt(i) == " " && text.charAt(i + 1) == " ") {
			t += "&nbsp;&nbsp;";
			i++;
		} else {
			t += text.charAt(i);
		}
	}
	setTimeout(function () {
		var next = document.createElement("p");
		next.innerHTML = t;
		next.className = style;

		before.parentNode.insertBefore(next, before);

		window.scrollTo(0, document.body.offsetHeight);
	}, time);
}

function loopLines(name, style, time) {
	name.forEach(function (item, index) {
		addLine(item, style, index * time);
	});
}

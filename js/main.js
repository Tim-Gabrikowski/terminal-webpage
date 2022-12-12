var before = document.getElementById("before");
var liner = document.getElementById("liner");
var command = document.getElementById("typer");
var textarea = document.getElementById("texter");
var terminal = document.getElementById("terminal");

var git = 0;

var commands = [];
var isRoot = false;

setTimeout(function () {
	loopLines(banner, "", 80);
	textarea.focus();
	liner.setAttribute(
		"data-before",
		`${isRoot ? "root" : "visitor"}@tim.gabrikowski.de:~$`
	);
}, 100);

window.addEventListener("keyup", enterKey);

//init
textarea.value = "";
command.innerHTML = textarea.value;

function enterKey(e) {
	if (e.keyCode == 181) {
		document.location.reload(true);
	}

	if (e.keyCode == 13) {
		commands.push(command.innerHTML);
		git = commands.length;
		addLine(
			`${isRoot ? "root" : "visitor"}@tim.gabrikowski.de:~$ ${
				command.innerHTML
			}`,
			"no-animation",
			0
		);
		commander(command.innerHTML.toLowerCase());
		liner.setAttribute(
			"data-before",
			`${isRoot ? "root" : "visitor"}@tim.gabrikowski.de:~$`
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

function commander(cmd) {
	// DEFINE COMMANDS HERE

	switch (cmd.toLowerCase()) {
		// help
		case "help":
			loopLines(help, "color2 margin", 80);
			break;

		//login
		case "login":
			if (!isRoot) {
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

		// banner
		case "banner":
			loopLines(banner, "", 80);
			break;

		// clear
		case "clear":
			setTimeout(function () {
				terminal.innerHTML = '<a id="before"></a>';
				before = document.getElementById("before");
			}, 1);
			break;

		// default
		default:
			addLine(
				'<span class="inherit">Command not found. For a list of commands, type <span class="command">\'help\'</span>.</span>',
				"error",
				100
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

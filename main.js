/* state variables */
var site_type = 'dark';  // 'control'

var cur_page = 'preface';

var privacy_menu_open = false;

var gave_phone = 0;  // provided phone number
var gave_first = 0;  // provided first name
var gave_last = 0;   // provided last name
var gave_zip = 0;    // provided ZIP code

var su_nightly = 0;  // signed up for the nightly newsletter
var su_sponsor = 0;  // signed up for the SPONSOR program

var permit_collect = 0;  // consent to collection of data
var permit_sale = 0;     // consent to sale of data


/* transition functions */
function nextPage() {
	
	if (privacy_menu_open) {
		privacyMenu();
	}
	
	// Advance from the primer page to the log-in page
	if (cur_page === 'preface') {
		
		// Hide old page
		var minipage = document.getElementById("preface-page");
		minipage.style.display = "none";
		
		// Reveal next page
		minipage = document.getElementById("credentials-page");
		minipage.style.display = "block";
		
		if (site_type === 'control') {
			var components = document.querySelectorAll("#credentials-page .control-only");
			i = 0
			for (i; i < components.length; i++) {
				components[i].style.display = 'inline-block';
			}
		}
		
		cur_page = 'credentials';
	
	// Advance from the log-in page to the EULA (with stipulations)
	} else if (cur_page === 'credentials') {
		
		// Hide old page
		var minipage = document.getElementById("credentials-page");
		minipage.style.display = "none";
				
		// Setup the next page based on control/dark site type
		if (site_type === 'control') {
			permit_collect = 1;
			permit_sale = 0;
			
			// Uncheck defaults
			document.getElementById("ncb").checked = false;  // newsletter
			document.getElementById("scb").checked = false;  // SPONSOR
		} else {
			permit_collect = 1;
			permit_sale = 1;
		}
		toggleDataCollection();  // cycle once so that things are setup right
		toggleDataSelling();
		toggleDataCollection();
		toggleDataSelling();
		
		// Reveal new page
		minipage = document.getElementById("eula-page");
		minipage.style.display = "block";
		
		cur_page = 'eula';
		
	// Advance from the EULA to the page leading off to the survey
	} else if (cur_page === 'eula') {
		
		// Hide old page
		var minipage = document.getElementById("eula-page");
		minipage.style.display = "none";
				
		// Record what information the user provided
		su_nightly = document.forms['newsletter-form']['newsletter-checkbox'].checked ? 1 : 0;
		su_sponsor = document.forms['sponsor-form']['sponsor-checkbox'].checked ? 1 : 0;
		
		// Setup the next page
		genHash();
		
		// Reveal new page
		minipage = document.getElementById("final-page");
		minipage.style.display = "block";
		
		cur_page = 'final';
	}
}

/* */
function validateCredentials() {
	var form = document.forms['credentials-form'];
	
	gave_phone = (form['phone-number'].value === "") ? 0 : 1;
	gave_first = (form['first-name'].value === "") ? 0 : 1;
	gave_last = (form['last-name'].value === "") ? 0 : 1;
	gave_zip = (form['zip-code'].value === "") ? 0 : 1;
	
	nextPage();
}

function privacyMenu() {  // TODO
	var minipage = document.getElementById("privacy-page");
	
	if (privacy_menu_open) {
		minipage.style.display = "none";
	} else {		
		minipage.style.display = "block";	
	}
	
	privacy_menu_open = !privacy_menu_open;
}

function toggleDataCollection() {
	var privacy_button = document.getElementById("privacy-button");
	var sell_button = document.getElementById("sell-button");
	
	// Toggle data collection OFF
	if (permit_collect == 0) {
		
		// The dark pattern uses emotional language and manipulative colors
		if (site_type === 'dark') {
			sell_button.style.display = "none";
			privacy_button.style.backgroundColor = "maroon";
			privacy_button.innerHTML = "Opt out of the ColorCocoa accesssibility initiave"
			
		// The control uses clear language and neutral colors
		} else {
			sell_button.style.display = "block";
			privacy_button.style.backgroundColor = "#4CAF50";
			privacy_button.innerHTML = "Opt out of data collection"
		}
		
	// Toggle data collection ON
	} else {
		
		// The dark pattern uses emotional language and manipulative colors, and hides options
		if (site_type === 'dark') {
			sell_button.style.display = "block";
			privacy_button.style.backgroundColor = "#4CAF50";
			privacy_button.innerHTML = "Opt in to helping the ColorCocoa accesssibility initiative!"
			
		// The control uses clear language and neutral colors
		} else {
			privacy_button.style.backgroundColor = "cornflowerblue";
			privacy_button.innerHTML = "Opt in to data collection"
		}
	}
		
	permit_collect = 1 - permit_collect;
}

function toggleDataSelling() {
	var sell_button = document.getElementById("sell-button");
	
	// Toggle data selling OFF
	if (permit_sale == 0) {
		
		// The dark pattern uses ambiguous language and manipulative colors
		if (site_type === 'dark') {
			sell_button.style.backgroundColor = "maroon";
			sell_button.innerHTML = "Don't sell my data";
			
		// The control uses clear language and neutral colors
		} else {
			sell_button.style.backgroundColor = "#4CAF50";
			sell_button.innerHTML = "Opt out (don't allow us to sell your data to third parties)";
		}
		
	// Toggle data selling ON
	} else {
		
		// The dark pattern uses ambiguous language and manipulative colors
		if (site_type === 'dark') {
			sell_button.style.backgroundColor = "#4CAF50";
			sell_button.innerHTML = "I'm fine with you selling my data";
			
		// The control uses clear language and neutral colors
		} else {
			sell_button.style.backgroundColor = "cornflowerblue";
			sell_button.innerHTML = "Opt in (allow us to sell your data to third parties)";
		}
	}
	
	permit_sale = 1 - permit_sale;
}

function openSurvey() {
    window.open("https://uchicago.co1.qualtrics.com/jfe/form/SV_5oHgC66RtIFB3ym", "_blank");
}

/* Hash the usage data with Base64 then present it in the appropriate field */
function genHash() {
	var key = btoa(
		"VALID" 
		
		+ site_type
		
		+ gave_phone
		+ gave_first
		+ gave_last
		+ gave_zip
		
		+ su_nightly
		+ su_sponsor
		
		+ permit_collect
		+ permit_sale
		
		+ "VALID"
	);
	document.getElementById("user-key").innerHTML = key;
}

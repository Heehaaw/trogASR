trogASR
========

TrogASR (`TR`anslating `O`nline `G`ame using `A`utomated `S`peech `R`ecognition) is, as the name suggests, 
an online game that focuses on translating various words and phrases from language to language, 
capturing them by using an [ASR library](https://github.com/UFAL-DSG/cloud-asr) (kudos to Ondřej Klejch).

The main goal of this project is to involve the user in an educational process that makes them use their particular language knowledge
for scoring points and competing for leaderboards positions.

### Installation

- `Python` environment has to be present on the target machine
- `Flask` microframework and its extensions `Flask-Assets` and `Flask-Sqlite3` have to be installed
- `configuration.py` file has to be modified to suit the deployment environment's needs
- Other than that, just deploy the application as you are used to and let the magic happen

### Facebook integration

The project supports interoperablity with the Facebook API, using its features of logging in, liking and sharing.
Be warned that this feature will NOT work unless configured by me through the Facebook-for-developers section or by you
by creating your own Facebook app and projecting the fact into the project's setup.
This means:
- Creating your FB app uder the developer section
- Generating an app-id
- Setting up the FB app for a particular url the project will run at
- Entering these values into the `configuration.py` config file

### Browser support

As the application itself is browser-based, this topic is somewhat relevant. Currently, the application is written using pure 
`HTML5`, `CSS3`, `JavaScript` and `jQuery`. Hence any browser that fully supports these standards / frameworks will do.
The functionality has been tested in Chrome, Opera Next and IE11. The first two browsers work just fine, IE, however, does not 
(and I doubt it ever will).

Also the fact the ASR library demands particular browser functionality cannot be omitted. More in the [ASR library documentation](http://www.cloudasr.com/documentation).

> Just stick with any modern webkit-based browser and you'll be fine.

### Internationalization

Due to clever app design choices, the application can be localized quite easily. Currently supported langages are Czech and English.

Adding another language consists of:
- Introducing the locale in the `i18n.js` file
- Adding a translation in said locale to every localization key in said file
- Providing styles for this locale (the icon the user will click in order to switch to the new language), eg
  
  ```css
  #localeSelector .localeSelectorItem.<your-locale-name> {
    background: url('<your-locale-icon>') no-repeat right top;
    background-size: contain;
  }
  ```
- If your language has any special characters, you will also have to provide these
 
  - Introduce the character into the `spriteFactory.js` module's letter map. The mapped value is a suffix for generated css class for the given letter.
    
    ```javascript
    var letterMap = {
    	//...
    	'♥': 'H1',
    	//...
    }
    ```
 
  - Provide the image styles for these characters, eg
    
    ```css
    .letter-H1 {
        background: url('<your-letter-image>') no-repeat right top;
    }
    ```
  - You can also do it a tad bit lazily and map your special characters to the already present ones (as it is done for Czech at the moment)

### Dictionary support

Because the game is based on translating stuff, it also needs good dictionaries. The ones present at the moment contain just some
stub data and will be enhanced later on. The ASR library currently supports only Czech and English, so the 'target' language
(the language the player speeks the words in) has to be one of these. This, however, does not prevent you from adding your custom
'source' language (the language the player translates the words from).

This is done as follows:
- Register yout language in the `options.js` module in the `languages` enum

  ```javascript
  var languages = {
    //...
  	<your-language-abbreviation-in-capitals>_EN: {
  		id: '<your-language-abbreviation-in-capitals>_EN',
  		// You have to create the i18n key as well
  		getText: APP.I18N.keys.OPTIONS_LANGUAGE_<your-language-abbreviation-in-capitals>_EN.getText,
  		source: '<your-language-abbreviation>',
  		target: '[en|cs]'
  	},
  	//...
  }
  ```

- Provide your dictionary in `csv` format, where the 1st word is the word in your 'source' language and the rest are its meanings in the 'target' language

  ```csv
  vůz;car;vehicle
  ```

- Import said dictionary to the database through the provided `import_dict.py` script

  ```python
  >>> from db.import_dict import import_dict
  >>> import_dict('<your-dictionary-path>', '<your-language-abbreviation>', '[en|cs]')
  ```
> Note that the `<your-language-abbreviation>`s have to match.
> Also note that the existing dictionaries can be extended easily using this method.

### A really, REALLY light-weight player guide

The running application is composed of 3 main modules - the game itself, options menu and leaderboards browsing.
Upon loading the app in your browser, the main menu will pop up, giving the player a selection of said main modules.

- The options menu lets the player configure the gameplay by modifying various settings, ranging from constraining the game and/or round time
to setting the total life count.

- The leaderboards browsing section displays player names and their respective achieved points. This display is based on the options 
configuration (every combination of options will render its own leaderboards display). A player can place in the leaderboards only if they 
opt to sign into the app via Facebook.

- The game is the meat of the app. Every round will fetch a random word and let the user translate it into the chosen language.
The 'record' button has to be pressed, the word spoken loudly and clearly (preferably in a quiet environment). After pressing the record button again,
the engine will query the ASR library for possible transcripts and evaluate the results. Upon losing all the lives, timing out or simply manually exiting the game,
the main menu will pop back up.

## Privacy & Terms
All data, including audio recording, is stored for the purpose of ASR quality improvement.
Note that the data can be shared with third parties for both research and commercial purposes.
All collected data will be made available to the ASR community; therefore, do not say anything you do not want
anyone to know about.

The service is available for free. As a result, no guarantees are given regarding the quality of
ASR results. As of now, it is a beta product; thus, things may break and the service may not be
available for large periods of time.

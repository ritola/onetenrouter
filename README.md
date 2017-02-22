# Oneten Router

Stanton DaScratch SCS.3D DJ controller router for Native Instruments Traktor 2
Pro. This is a replacement for Stanton DaRouter running from command line on
MacOS, Windows or Linux.

# Current status

Finding basic MIDI communication between Oneten Router and dual DaScratch
controller. Not production ready.

* Help is needed to test Windows support

## Roadmap

Future releases:

### 0.1.0

* Deck selection and swapping
* Play, Cue, Sync and Tap buttons get routed

### 0.2.0

* Tempo adjust
* Level display

### 0.3.0

* Basic movement

### 0.4.0

* Loop mode

### 0.5.0

* Trigger mode

### 0.6.0

* Beat matching
* Scratching

### 1.0.0

Software can be used in DJ gig in the place of DaRouter

* Two track deck controlling supported (Like with DaRouter)
* No remix deck support
* Volume and EQ controls scoped out (see Z1 prerequisite)

### 1.1.0

Remix deck support

* Fixed A & B track decks, and C & D remix decks setup
* Volume and EQ controls scoped out (see Z1 prerequisite)

### 1.2.0

Volume, equalizer and effects control support using only 2 x SCS.3D

* Fixed A & B track decks, and C & D remix decks setup

### 1.3.0

Your turn. Tell me in which setup you would like to use the router.

# Running

## Prerequisites

* Hardware: 2 x Stanton DaScratch SCS.3D DJ controller
* Hardware: Additional Traktor Control Z1 (planned to be removed at 1.2.0)
* Commercial Software: Traktor 2 Pro
* Software: Node.js (7.3.0 installed for example using Homebrew or NVM)

### MacOS

* Software: XCode (installed for example using App Store)

### Fedora Linux

    sudo dnf install alsa-lib-devel

## Preparation

In Traktor, add the corresponding TSI file in the _Preferences_ -> _Controller
Manager_ -> _Device Setup_ screen, by selecting _Add..._ -> _Import TSI_ ->
_Stanton_ -> _SCS3 System_.

Run the following comand on `onetenrouter` directory:

    npm install

## Starting

    npm start

## Stopping

Press Ctrl-C (both PC and MacOS).

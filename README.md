# Oneten Router

Stanton DaScratch SCS.3D DJ controller router for Native Instruments Traktor 2
Pro. This is a replacement for Stanton DaRouter running from command line on
Windows or MacOS.

# Current status

Finding basic MIDI communication between Oneten Router and single DaScratch
controller. Not production ready.

## Roadmap

Future releases:

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

Volume and EQ control support using only 2 x SCS.3D

* Fixed A & B track decks, and C & D remix decks setup

### 1.3.0

Your turn. Tell me in which setup you would like to use the router.

# Running

## Prerequisites

* Hardware: 2 x Stanton DaScratch SCS.3D DJ controller
* Hardware: Additional Traktor Control Z1 (planned to be removed at 1.2.0)
* Commercial Software: Traktor 2 Pro
* Corresponding TSI file installed on Traktor (need to be described later)
* Software: Node.js (7.3.0 installed for example using NVM)

## Preparation

    npm install

## Starting

    npm start

## Stopping

Press Ctrl-C (both PC and MacOS).

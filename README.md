# C-SNIPPETS ![version](https://img.shields.io/npm/v/c-snippet?color=red&style=flat-square)
--- 
* ### [English Documentation](#index)
* ### [Documentacion en Español](#indice)
* ### [Contributions](#contributions)
--- 
## Index

- [C-SNIPPETS ](#c-snippets-)
  - [Index](#index)
    - [Introduction](#introduction)
    - [Installation](#installation)
    - [Usage](#usage)
    - [Instructions for generated files](#instructions-for-generated-files)
      - [Visual Studio Code](#visual-studio-code)
      - [Atom](#atom)
      - [Sublime Text](#sublime-text)
      - [Dreamweaver](#dreamweaver)
  - [Indice](#indice)
    - [Introduccion](#introduccion)
    - [Instalacion](#instalacion)
    - [Modo de uso](#modo-de-uso)
    - [Pasos para archivos generados](#pasos-para-archivos-generados)
      - [Visual Studio Code](#visual-studio-code-1)
      - [Atom](#atom-1)
      - [Sublime Text](#sublime-text-1)
      - [Dreamweaver](#dreamweaver-1)
  - [Contributions](#contributions)


### Introduction

c-snippet aim to convert your snippets for use in your preferred editor.

### Installation

You can download one of the ***executables inside [the bin folder](https://github.com/FragnaroK/tools/tree/main/c-snippet/bin/x64)*** and add it to your **PATH** (or create an alias), or install the tool with nodejs globally.

        npm install c-snippet -g

        npm i c-snippet -g

> To run the executable on Linux and MacOS, you will have to give it permissions with "sudo chmod 0755 [bin name]" or "sudo chmod +x [bin name]". 
### Usage
```bat 
    c-snippet -t <code editor> -f <file> -c <code editor> -o <output>
    
    Options:
    
                    Code editors: [ dw, atom, vscode, sublime ]
    
        -t, --type            Editor of the snippets to convert               [string]
        -f, --file, --folder  Folder/file to convert                          [string]
        -c, --convertTo       Choose your preferred editor                    [string]
        -o, --output          Optional output name folder/file/path           [string]
        -h                    Show help                                      [boolean]
        -v                    Show version number                            [boolean]
```
* To convert snippets from dreamweaver or sublime, the snippets **MUST** be saved in a folder (even if it is only one).
### Instructions for generated files

#### Visual Studio Code


1. Open the editor and select:

         File > Preferences (Code > Preferences on macOS)

2. Select preferred option: *"New global snippets file"*
3. Copy all the snippets of the file generated into the file opened with VScode
4. Save, close vscode and that's all :)

#### Atom

1. Open Atom and go to: 

        File > Snippets

2. Then it will open the snippets file of atom, copy the snippets generated into that file

***If you want to add several snippets from different languages in the same file, separate them like this***
```js
        # GLOBAL 
        '*':
            'nameSnippets':
                'prefix': 'snip' (trigger)
                'body': '<tag> code </tag>'
            'nameSnippets':
                'prefix': 'snip' (trigger)
                'body': '$(document).someFunction({})'
            'nameSnippets':
                'prefix': 'snip' (trigger)
                'body': '<tag> code </tag>'
        # HTML
        '.text.html.basic':
            'nameSnippets':
                'prefix': 'snip' (trigger)
                'body': '<tag> code </tag>'
            'nameSnippets':
                'prefix': 'snip' (trigger)
                'body': '<tag> code </tag>'
            'nameSnippets':
                'prefix': 'snip' (trigger)
                'body': '<tag> code </tag>'
        # CSS
        '.text.css':
            'nameSnippets':
                'prefix': 'snip' (trigger)
                'body': '.Code {}'
            'nameSnippets':
                'prefix': 'snip' (trigger)
                'body': '.Code {}'
            'nameSnippets':
                'prefix': 'snip' (trigger)
                'body': """
                .Code {
                     position: relative;
                     background-color: idk;   
                }
                
                """
```
#### Sublime Text

1. Open Sublime:

    You can save them **(copy the whole folder)** to your Packages/User folder and then reload. Below are the variations of the path to find "packages/user".

    ##### Sublime 2

        Windows: %APPDATA%\Sublime Text 2
        OS X: ~/Library/Application Support/Sublime Text 2
        Linux: ~/.config/sublime-text-2

    ##### Sublime 3

        Windows: %APPDATA%\Sublime Text 3
        OS X: ~/Library/Application Support/Sublime Text 3
        Linux: ~/.config/sublime-text-3

    ##### Sublime 4

        Windows: %APPDATA%\Sublime Text
        OS X: ~/Library/Application Support/Sublime Text
        Linux: ~/.config/sublime-text 

2. Copy the folder




#### Dreamweaver

1. Find the dreamweaver folder:

        C:\Users\%USERNAME%\AppData\Roaming\Adobe\Dreamweaver

> May you'll find folders from different versions. 
    You have to find the folder "en_US" or your language folder, 
    then go to "Configuration/snippets" and there is where you should copy the folder with the snippets.

2. After copying the generated snippets folder (**DO NOT** change the name of the folder, because the triggers will not work), copy the "dwSnippets.json" file into the snippets folder (Not the generated ones), because it contains the triggers for all the snippets.

***If there already exists a "dwSnippets.json" file, DO NOT DELETE IT because it has the triggers of all your old snippets and dreamweaver pre-configured snippets. 
     Just copy the addded content into that file.(pay attention to the structure of the object)***

---
---

## Indice

- [C-SNIPPETS ](#c-snippets-)
  - [Index](#index)
    - [Introduction](#introduction)
    - [Installation](#installation)
    - [Usage](#usage)
    - [Instructions for generated files](#instructions-for-generated-files)
      - [Visual Studio Code](#visual-studio-code)
      - [Atom](#atom)
      - [Sublime Text](#sublime-text)
      - [Dreamweaver](#dreamweaver)
  - [Indice](#indice)
    - [Introduccion](#introduccion)
    - [Instalacion](#instalacion)
    - [Modo de uso](#modo-de-uso)
    - [Pasos para archivos generados](#pasos-para-archivos-generados)
      - [Visual Studio Code](#visual-studio-code-1)
      - [Atom](#atom-1)
      - [Sublime Text](#sublime-text-1)
      - [Dreamweaver](#dreamweaver-1)
  - [Contributions](#contributions)


### Introduccion

c-snippet tienen como objetivo convertir tus snippets para utilizarlos en tu editor preferido

### Instalacion

Puedes descargar uno de los ***ejecutables dentro de la [carpeta "bin"](https://github.com/FragnaroK/tools/tree/main/c-snippet/bin/x64)*** y agregarlo a tu PATH (o crear un alias), o instalar la herramienta desde nodejs globalmente.

        npm install c-snippet -g

        npm i c-snippet -g

> Para iniciar el ejecutable en Linux y MacOS, tendras que darle permisos con "sudo chmod 0755 [bin name]" o  "sudo chmod +x [bin name]"
### Modo de uso
```bat 
    c-snippet -t <code editor> -f <file> -c <code editor> -o <output>

    Options:

                    Code editors: [ dw, atom, vscode, sublime ]

        -t, --type            Editor de los snippets a convertir              [string]
        -f, --file, --folder  Carpeta/archivo a convertir                     [string]
        -c, --convertTo       Selecciona tu editor preferido                  [string]
        -o, --output          Nombre/path de salida opcional                  [string]
        -h                    Mostrar ayuda                                  [boolean]
        -v                    Mostrar version                                [boolean]
```
* Para convertir snippets de dreamweaver o sublime, los snippets **TIENEN** que estar guardados en una carpeta (incluso si solo es uno)
### Pasos para archivos generados

#### Visual Studio Code


1. Abrir el editor y seleccionar:

         archivo > Preferencias (Code > Preferencias en macOS)

2. Seleccionar la opcion preferida: *"Archivo nuevo de snippets globales"*
3. Copiar todos los snippets dentro del archivo generado en el archivo creado dentro de VScode
4. Guardar, cerrar y eso es todo :)

#### Atom

1. Abrir atom y seleccionar: 

        archivo > Snippets

2. Luego se abrira un archivo llamado "snippets.cson", copie todo los snippets dentro de ese archivo.

***Si lo desea puede agregar varios snippets de diferentes lenguajes en un mismo archivo haciendo lo siguiente***
```js
        # GLOBAL 
        '*':
            'nameSnippets':
                'prefix': 'snip' (trigger)
                'body': '<tag> code </tag>'
            'nameSnippets':
                'prefix': 'snip' (trigger)
                'body': '$(document).someFunction({})'
            'nameSnippets':
                'prefix': 'snip' (trigger)
                'body': '<tag> code </tag>'
        # HTML
        '.text.html.basic':
            'nameSnippets':
                'prefix': 'snip' (trigger)
                'body': '<tag> code </tag>'
            'nameSnippets':
                'prefix': 'snip' (trigger)
                'body': '<tag> code </tag>'
            'nameSnippets':
                'prefix': 'snip' (trigger)
                'body': '<tag> code </tag>'
        # CSS
        '.text.css':
            'nameSnippets':
                'prefix': 'snip' (trigger)
                'body': '.Code {}'
            'nameSnippets':
                'prefix': 'snip' (trigger)
                'body': '.Code {}'
            'nameSnippets':
                'prefix': 'snip' (trigger)
                'body': """
                .Code {
                     position: relative;
                     background-color: idk;   
                }
                
                """
```
#### Sublime Text

1. Abrir sublime:

    Puede guardar la carpeta dentro de su carpeta "Package/User" y luego reiniciar sublime. Debajo estan las diferentes variaciones de la direccion para encontrar dicha carpeta.

    ##### Sublime 2

        Windows: %APPDATA%\Sublime Text 2
        OS X: ~/Library/Application Support/Sublime Text 2
        Linux: ~/.config/sublime-text-2

    ##### Sublime 3

        Windows: %APPDATA%\Sublime Text 3
        OS X: ~/Library/Application Support/Sublime Text 3
        Linux: ~/.config/sublime-text-3

    ##### Sublime 4

        Windows: %APPDATA%\Sublime Text
        OS X: ~/Library/Application Support/Sublime Text
        Linux: ~/.config/sublime-text 

2. Copiar la carpeta de snippets generados dentro de esa carpeta




#### Dreamweaver

1. Encontrar la carpeta de dreamweaver:

        C:\Users\%USERNAME%\AppData\Roaming\Adobe\Dreamweaver (quiza se vea algo diferente)
> Quiza encuentre carpetas con diferentes versiones, tiene que buscar dentro de las mismas una carpeta con su idioma (ej. "es_ES").
        Luego dirijase a "Configuration/snippets" y una vez dentro, copie la carpeta con los snippets

2. Luego de copiar la carpeta de snippets (**NO** cambie el nombre, en tal caso los trigger no funcionaran), copie el archivo "dwSnippets.json" **fuera de la carpeta generada**, ya que contiene los desencadenantes de los snippets.

***Si se encuentra con un archivo "dwSnippets.json" ya existente, NO LO ELIMINE ya que contiene los desencadenantes configurados anteriormente por usted o el propio dreamweaver. Solo agrege los generados a ese mismo archivo (prestar atencion a la estructura del objeto)***


## Contributions

Any help is welcome, make a fork of my repository and create a pull request for any improvements. If help is needed on something or a new code editor is needed, contact me (contact info in the help menu -h) or start an issue.

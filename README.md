# Proton 3D Viewer

![Proton Logo](public/logo.png)


## Description
**Proton** is a lightweight, minimal 3D viewer solution based completely in the browser that gets out of your way - just upload and view! No sign up required, no cookies, and no annoying popups or ads.

## Features
The app comes with a few intuitive and very easy-to-use features - these are considered *opt-in*, which means they are not enabled by default. This ensures that the model can occupy as much of the screen as possible at all times, without an UI elements blocking any details.

* Adjustable camera zoom
* Adjustable model rotation
* Toggable model attributes and statistics

## Supported 3D Model Types
Proton supports a variety of 3D model types, but there are certain extensions that it does not currently have support for. Support may change in the future, and of course, feature requests can be made in a [new issue](https://github.com/RunItBack1127/Proton3DViewer/issues/new) with the `feature` tag. The community is free to [implement a new loader](#implementing-new-loaders) and [create a pull request](https://github.com/RunItBack1127/Proton3DViewer/pulls) with their changes. Additionally, this list is *not* exhaustive, and if your model type is not listed here, it's safe to assume it is not supported.

| 3D Model Type                    | Supported          |
| -------------------------------- | ------------------ |
| .OBJ  (Wavefront OBJ file )      | :heavy_check_mark: |
| .PLY  (Polygon file format)      | :heavy_check_mark: |
| .GLTF (Khronos GTLF file)        | :heavy_check_mark: |
| .STL  (Stereolithography file)   | :heavy_check_mark: |
| .GLB  (Khronos GLTF binary file) | :heavy_check_mark: |
| .FBX  (Autodesk FBX file)        | :heavy_check_mark: |
| .3DM  (Rhino 3DM file)           | :heavy_check_mark: |
| .3DS  (3D Studio file)           | :x: |
| .DAE  (Collada file)             | :x: |
| .BIM  (Dotbim file)              | :x: |
| .3MF  (3D Manufacturing file)    | :x: |

## Local Development
Proton is built using [Vue](https://vuejs.org/) and [Typescript](https://typescriptlang.org), and is bundled using [Vite](https://vitejs.dev). For deployment, a [Cloud Build trigger](https://cloud.google.com/build/docs/triggers) is activated on any action to the `main` branch (pull request, commit, etc.); the trigger builds the project and deploys the compiled static build files to an [App Engine instance](https://cloud.google.com/appengine/docs/legacy/standard/python/an-overview-of-app-engine) - the instance initializes an [Express](https://expressjs.com) server, which serves back the app to the client.

### Cloning the repo

#### Using HTTPS

```git clone https://github.com/RunItBack1127/Proton3DViewer.git Proton3DViewer```


#### Using SSH

```git clone git@github.com:RunItBack1127/Proton3DViewer.git Proton3DViewer```

### Starting local server
```yarn dev```

In the Google Cloud environment, an Express server is instantiated that serves the compiled `index.html` file back to the client. To initialize the Express server instead, use

```yarn run start```

### Docker environment
An [NGINX](https://nginx.com) middleware is provisioned in front of the web app in the Docker environment, similar to how the app is deployed in the App Engine environment.

#### Building Docker container

```docker-compose build```

#### Running Docker container
```docker-compose up --remove-orphans --force-recreate```

#### Stopping Docker execution
```docker-compose down -v```

## Implementing New Loaders
Proton delegates to the loaders defined in the Three.js library for parsing mesh geometry. Each 3D model type is represented by its respective 3D model wrapper class (e.g. `OBJLoader`, `GLTFLoader`, etc.).

All of the loaders implemented in Proton inherit baseline functionality from the `CustomLoader` class. In this base class, the `FileReader` browser API is used to read the contents of the 3D model file as uploaded by the user, and this data (read as binary, plaintext, etc.) is then passed to an associated Three.js loader to be parsed and displayed. Each custom loader class needs to implement the following abstract functionality of the `CustomLoader`:

* ```loadFileContents()``` - this method is passed a `FileReader` and a `File` to be read by the reader; all custom loaders need to define how the file will be read by the reader, i.e. as plaintext, as binary or as an array buffer (typically, 3D model formats will delegate to use one of the latter)

* ```onFinished()``` - passed the contents of the `FileReader` as determined by `loadFileContents()`; this will invoke the `parse()` method of the associated Three.js loader and pass the created `Object3D` to the `onComplete` method, which will display the model on the frontend

### Standard Loader
```
// Sibling abstract loader class to CustomLoader - simply defines that
// the PLY file will be read as an ArrayBuffer using the FileReader API
import { ArrayBufferCustomLoader } from "./CustomLoader";

import { GLTFLoader as THREE_GLTF } from 'three/examples/jsm/loaders/GLTFLoader';

class GLTFLoader extends ArrayBufferCustomLoader {

    constructor() {
        super( new THREE_GLTF() );
    }

    onFinished(result: string | ArrayBuffer | null): void {
        const loader = this.getLoader() as THREE_GLTF;
        
        // Three.js GLTFLoader expects 4 arguments - we pass the onComplete as
        // the 3rd argument; this will display the model on the screen
        // (modelScene.scene is an Object3D)
        loader.parse( result as ArrayBuffer, "", ( modelScene ) => {
            this.onComplete( modelScene.scene );
        }, this.onError );
    }

    onError(error: ErrorEvent): void {
        console.error( error );
    }
}

export { GLTFLoader };
```

### Edge Case Loader
```
import { PLYLoader as THREE_PLY } from 'three/examples/jsm/loaders/PLYLoader';

// Sibling abstract loader class to CustomLoader - simply defines that
// the PLY file will be read as an ArrayBuffer using the FileReader API
import { ArrayBufferCustomLoader } from './CustomLoader';

class PLYLoader extends ArrayBufferCustomLoader {

    constructor() {
        super( new THREE_PLY() );
    }

    onFinished(result: string | ArrayBuffer | null): void {
        const loader = this.getLoader() as THREE_PLY;
        
        // NOTE: Edge case - the parse() method for Three.js PLYLoader does
        // not return an Object3D, so we create one with a white material
        // (all loaders can do this as it is defined in the CustomLoader
        // abstract class)
        const bufferGeometry = loader.parse( result as ArrayBuffer );
        const model = super.createMesh( bufferGeometry );
        
        // Display the Object3D on the canvas
        this.onComplete( model );
    }
}

export { PLYLoader };
```

More examples can be seen in the [loaders source code](src/util/loaders).

## Attribution
* [Three.js](https://threejs.org)
* [Google Material Icons](https://fonts.google.com/icons)

## Related Projects

### [Online3DViewer](https://3dviewer.net)
* **The absolute OG** - has a lot more support and maturity than this project, so if you can't view your specific file type here, then your best bet is definitely  over there.

export enum Action {
  NONE,
  PENCIL,
  SELECT,
  SHAPES,
  LINES,
  ERASER,
  BACKGROUND,
  FILL_AND_STROKE,
  ADD_IMAGE,
  RUN,
  MENU,
}

export enum Modes {
  IMG2IMG,
  IN_PAINTING,
  TEXT2IMG,
}

export class Vector2D {
  x: number;
  y: number;

  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }
}

export interface Color {
  rgb: string;
  alpha: number;
}

export interface FASContext {
  thickness: number;
  stroke_color: string;
  fill_color: string;
  transparency: number;
}

export interface LinesContext {
  closed: boolean;
  full: boolean;
}

export interface ShapesContext {
  stroke: boolean;
  full: boolean;
}

export enum BackgroundImageMode {
  NONE,
  CUT,
  STRETCH,
}

export interface BackgroundContext {
  color: string;
  image: string | null;
  mode: BackgroundImageMode;
}

enum CreationMethod {
  IMPORT,
  IMG2IMG,
  TEXT2IMG,
  IN_PAINTING,
  EXPANDED,
}

export interface AdditionalInformation {
  version: number;
  information: string;
}

export interface Model {
  name: string;
  parameters: Array<{ name: string; value: string }>;
}

export class Image {
  src: string = $state("");
  drawing: boolean = $state(false);
  name: string = $state("");
  model_used: string | null = $state(null);
  parent_address: string | null = $state(null);
  lost_parents: number = $state(0);
  children_addresses: Array<string> = $state([]);
  creation_method: CreationMethod = $state(CreationMethod.IMPORT);
  prompt?: string | null = $state(null);
  additional_information?: AdditionalInformation | null = $state(null);

  constructor(
    src: string,
    name: string,
    creation_method: CreationMethod,
    drawing: boolean = false,
    model_used: string | null = null,
    parent_address: string | null = null,
    prompt: string | null = null,
    additional_information: AdditionalInformation | null = null
  ) {
    this.src = src;
    this.name = name;
    this.creation_method = creation_method;
    this.drawing = drawing;
    this.model_used = model_used;
    this.parent_address = parent_address;
    this.prompt = prompt;
    this.additional_information = additional_information;
  }
}

import { VALID_NAME_CHARS, IMPORTS_FOLDER_NAME } from "./constants";

export class VirtualDir {
  address: string = $state("");
  dirs: Array<VirtualDir> = $state([]);
  images: Array<Image> = $state([]);

  constructor(address: string) {
    this.address = address;
  }

  getName() {
    return this.address.split("/").pop();
  }

  contains(file_name: string): boolean {
    file_name = file_name.trim();
    for (let i = 0; i < this.dirs.length; i++) {
      if (this.dirs[i].getName() === file_name) return true;
    }

    for (let i = 0; i < this.images.length; i++) {
      if (this.images[i].name === file_name) return true;
    }

    return false;
  }

  newDir(name: string): { success: boolean; error_message: string } {
    name = name.trim();
    if (name.length === 0)
      return {
        success: false,
        error_message: "Directory must have a name",
      };

    for (let i = 0; i < name.length; i++) {
      if (!VALID_NAME_CHARS.includes(name[i])) {
        return {
          success: false,
          error_message:
            "Directory name can only include alphanumerical characters, -, _ and spaces",
        };
      }
    }

    if (this.contains(name)) {
      return {
        success: false,
        error_message: "The file already exists in the directory",
      };
    }

    this.dirs.push(new VirtualDir(this.address + "/" + name));
    return { success: true, error_message: "" };
  }

  importImage(src: string) {
    if (!this.contains(IMPORTS_FOLDER_NAME)) this.newDir(IMPORTS_FOLDER_NAME);
    let import_address = this.getName() + "/" + IMPORTS_FOLDER_NAME;
    let imports_dir = this.getChild(import_address);

    if (!(imports_dir instanceof VirtualDir)) return;

    let name = "Imported" + (imports_dir.images.length + 1);
    imports_dir.images.push(new Image(src, name, CreationMethod.IMPORT));
  }

  /*
    To get the image in /root/dir/image
    you pass that route to root (the object called is included in the route)
  */
  getChild(address: string): VirtualDir | Image | null {
    let steps = address.split("/");
    if (!steps[0]) steps = steps.slice(1);
    if (!steps[steps.length - 1]) steps.pop();
    steps = steps.splice(1);

    if (steps.length === 0) return this;

    for (let i = 0; i < this.dirs.length; i++) {
      if (this.dirs[i].getName() === steps[0])
        return this.dirs[i].getChild(steps.join("/"));
    }

    if (steps.length !== 1) return null;

    for (let i = 0; i < this.images.length; i++) {
      if (this.images[i].name === steps[0]) return this.images[i];
    }

    return null;
  }
}

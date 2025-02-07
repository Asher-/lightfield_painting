import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import compiler from '@ampproject/rollup-plugin-closure-compiler';
import fs from 'fs';
// import polyfill from 'rollup-plugin-polyfill';

let output_path_prefix = 'dist';
let output_file_extension = 'js';

import * as tsconfig from './tsconfig.json';
const files = tsconfig.files;

function outputConfig( input_file, output_file ) {
  return {
  input: input_file,
  output: {
    file: output_file,
    format: 'iife',
    sourcemap: true,
    name: "PhotoshopDOM"
  },
  treeshake: false,
  plugins: [
    typescript({
      sourceMap: false
    }),
    nodeResolve(),
    compiler({
      language_in:  'ECMASCRIPT6',
      language_out: 'ECMASCRIPT3',
      // js: input_file,
      // js_output_file: output_file,
      formatting: 'PRETTY_PRINT',
      compilation_level: 'SIMPLE_OPTIMIZATIONS',
      isolation_mode: 'IIFE',
      assume_function_wrapper: true,
      debug: true
    })//,
    // polyfill(['polyfill_array.js', 'polyfill_isarray.js'])
  ] };
};

class Configs
{
  constructor()
  {
    this.files = new Map;
    this.configs = [];
  }

  // Assumes file not directory
  addFilePath( file_path )
  {
    if (   file_path.endsWith( '.ts' )
      && ! this.files.has( file_path ) ) {
      this.files.set( file_path, true );
    }
  }

  addFilePaths( file_path_array )
  {
    for ( let this_file_path of file_path_array ) {
      this.addFilePath( this_file_path );
    }
  }

  initConfigs()
  {
    for ( let [this_file,true_value] of this.files ) {
      this.initConfigForFile( this_file );
    }
  }

  initConfigForFile( file_path )
  {
    let path_parts = file_path.split('/');
    let filename = path_parts[path_parts.length - 1];
    let path = path_parts.slice( 0, path_parts.length - 1 );
    let base_name = filename.split('.')[0];
    let output_file = base_name + '.' + output_file_extension;
    path.push(output_file);
    path[0] = output_path_prefix;
    let output_path = path.join('/');

    let file_config = outputConfig( file_path, output_path );
    this.configs.push( file_config );
  }
}
class SourcesForIdentifier
{
  constructor( identifier )
  {
    this.identifier = identifier;
    
    let identifiers_includes_script_path = ( this.identifier.startsWith( 'script' ) || this.identifier.startsWith( process.cwd() ) ) ? true : false; 


    this.path = identifiers_includes_script_path ? identifier : 'script/' + identifier;
    this.files = [];

    this.initForIdentifier();
    this.initSourcePaths( this.path );
  }

  initForIdentifier()
  {
    this.pathExists = fs.existsSync( this.path );
    if ( ! this.pathExists ) {
      this.path = this.identifier + '.ts';
      this.pathExists = fs.existsSync( this.path );
      if ( ! this.pathExists ) {
        this.path = this.identifier + '.js';
        this.pathExists = fs.existsSync( this.path );
      }
      if ( ! this.pathExists ) {
        throw "Could not find files corresponding to path: " + this.identifier;
      }
    }
  }

  initSourcePaths( path )
  {
    let path_info = fs.lstatSync( path );
    if ( path_info.isDirectory() ) {
      this.initSourcePathsForDirectory( path );
    } 
    else if ( path_info.isFile() ) {
      this.initSourcePathForFile( path );
    }

  }

  initSourcePathForFile( file_path )
  {
    this.files.push( file_path );
  }

  initSourcePathsForDirectory( directory_path )
  {
    let files = fs.readdirSync(directory_path );  
    directory_path = directory_path.trimEnd('/');
    for ( let this_file of files ) {
      if ( ! this_file.startsWith('.') ) {
        this.initSourcePaths( directory_path + '/' + this_file );
      }
    }
  }

}

/* 
  Sources: path/to/dir or path/to/file
*/ 
let sources = [];
let configs = new Configs;
let source_identifiers = process.env.source_identifiers ? process.env.source_identifiers.split(" ") : [ "" ];
for ( let this_identifier of source_identifiers ) {
  let this_source = new SourcesForIdentifier( this_identifier );
  sources.push( this_source );
  configs.addFilePaths( this_source.files );
}

configs.initConfigs();

let result_configs = configs.configs;
export default result_configs;

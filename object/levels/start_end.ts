
class StartEnd {
  absolute?: number = undefined;
  offset?: number = undefined; 

  toString() {
    let details:string[] = [];
    if ( this.absolute !== undefined ) {
      details.push( "absolute:" + this.absolute );
    }
    if ( this.offset !== undefined ) {
      details.push( "offset:" + this.offset );
    }
    
    let string = "(" + details.join(" ") + ")";
    return string;
  }

  duplicate()
  {
    let copy = new StartEnd;
    copy.absolute = this.absolute;
    copy.offset = this.offset;
    return copy;
  }

}

export { StartEnd };
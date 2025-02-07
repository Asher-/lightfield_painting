var $$jscomp$$ = $$jscomp$$ || {};
$$jscomp$$.scope = {};
$$jscomp$$.arrayIteratorImpl = function($array$jscomp$6$$) {
  var $index$jscomp$73$$ = 0;
  return function() {
    return $index$jscomp$73$$ < $array$jscomp$6$$.length ? {done:!1, value:$array$jscomp$6$$[$index$jscomp$73$$++], } : {done:!0};
  };
};
$$jscomp$$.arrayIterator = function($array$jscomp$7$$) {
  return {next:$$jscomp$$.arrayIteratorImpl($array$jscomp$7$$)};
};
$$jscomp$$.makeIterator = function($iterable$jscomp$4$$) {
  var $iteratorFunction$$ = "undefined" != typeof Symbol && Symbol.iterator && $iterable$jscomp$4$$[Symbol.iterator];
  return $iteratorFunction$$ ? $iteratorFunction$$.call($iterable$jscomp$4$$) : $$jscomp$$.arrayIterator($iterable$jscomp$4$$);
};
$$jscomp$$.arrayFromIterator = function($iterator$jscomp$6$$) {
  for (var $i$jscomp$3$$, $arr$jscomp$1$$ = []; !($i$jscomp$3$$ = $iterator$jscomp$6$$.next()).done;) {
    $arr$jscomp$1$$.push($i$jscomp$3$$.value);
  }
  return $arr$jscomp$1$$;
};
$$jscomp$$.arrayFromIterable = function($iterable$jscomp$5$$) {
  return $iterable$jscomp$5$$ instanceof Array ? $iterable$jscomp$5$$ : $$jscomp$$.arrayFromIterator($$jscomp$$.makeIterator($iterable$jscomp$5$$));
};
$$jscomp$$.ASSUME_ES5 = !1;
$$jscomp$$.ASSUME_NO_NATIVE_MAP = !1;
$$jscomp$$.ASSUME_NO_NATIVE_SET = !1;
$$jscomp$$.SIMPLE_FROUND_POLYFILL = !1;
$$jscomp$$.ISOLATE_POLYFILLS = !1;
$$jscomp$$.FORCE_POLYFILL_PROMISE = !1;
$$jscomp$$.FORCE_POLYFILL_PROMISE_WHEN_NO_UNHANDLED_REJECTION = !1;
$$jscomp$$.objectCreate = $$jscomp$$.ASSUME_ES5 || "function" == typeof Object.create ? Object.create : function($prototype$$) {
  function $ctor$$() {
  }
  $ctor$$.prototype = $prototype$$;
  return new $ctor$$;
};
$$jscomp$$.defineProperty = $$jscomp$$.ASSUME_ES5 || "function" == typeof Object.defineProperties ? Object.defineProperty : function($target$jscomp$92$$, $property$jscomp$5$$, $descriptor$jscomp$1$$) {
  if ($target$jscomp$92$$ == Array.prototype || $target$jscomp$92$$ == Object.prototype) {
    return $target$jscomp$92$$;
  }
  $target$jscomp$92$$[$property$jscomp$5$$] = $descriptor$jscomp$1$$.value;
  return $target$jscomp$92$$;
};
$$jscomp$$.getGlobal = function($passedInThis_possibleGlobals$$) {
  $passedInThis_possibleGlobals$$ = ["object" == typeof globalThis && globalThis, $passedInThis_possibleGlobals$$, "object" == typeof window && window, "object" == typeof self && self, "object" == typeof global && global, ];
  for (var $i$jscomp$4$$ = 0; $i$jscomp$4$$ < $passedInThis_possibleGlobals$$.length; ++$i$jscomp$4$$) {
    var $maybeGlobal$$ = $passedInThis_possibleGlobals$$[$i$jscomp$4$$];
    if ($maybeGlobal$$ && $maybeGlobal$$.Math == Math) {
      return $maybeGlobal$$;
    }
  }
  throw Error("Cannot find global object");
};
$$jscomp$$.global = $$jscomp$$.getGlobal(this);
$$jscomp$$.IS_SYMBOL_NATIVE = "function" === typeof Symbol && "symbol" === typeof Symbol("x");
$$jscomp$$.TRUST_ES6_POLYFILLS = !$$jscomp$$.ISOLATE_POLYFILLS || $$jscomp$$.IS_SYMBOL_NATIVE;
$$jscomp$$.polyfills = {};
$$jscomp$$.propertyToPolyfillSymbol = {};
$$jscomp$$.POLYFILL_PREFIX = "$jscp$";
$$jscomp$$.polyfill = function($target$jscomp$94$$, $polyfill$jscomp$1$$, $fromLang$$, $toLang$$) {
  $polyfill$jscomp$1$$ && ($$jscomp$$.ISOLATE_POLYFILLS ? $$jscomp$$.polyfillIsolated($target$jscomp$94$$, $polyfill$jscomp$1$$, $fromLang$$, $toLang$$) : $$jscomp$$.polyfillUnisolated($target$jscomp$94$$, $polyfill$jscomp$1$$, $fromLang$$, $toLang$$));
};
$$jscomp$$.polyfillUnisolated = function($target$jscomp$95$$, $polyfill$jscomp$2$$) {
  for (var $obj$jscomp$26$$ = $$jscomp$$.global, $property$jscomp$7_split$$ = $target$jscomp$95$$.split("."), $i$jscomp$5_orig$$ = 0; $i$jscomp$5_orig$$ < $property$jscomp$7_split$$.length - 1; $i$jscomp$5_orig$$++) {
    var $impl_key$jscomp$37$$ = $property$jscomp$7_split$$[$i$jscomp$5_orig$$];
    if (!($impl_key$jscomp$37$$ in $obj$jscomp$26$$)) {
      return;
    }
    $obj$jscomp$26$$ = $obj$jscomp$26$$[$impl_key$jscomp$37$$];
  }
  $property$jscomp$7_split$$ = $property$jscomp$7_split$$[$property$jscomp$7_split$$.length - 1];
  $i$jscomp$5_orig$$ = $obj$jscomp$26$$[$property$jscomp$7_split$$];
  $impl_key$jscomp$37$$ = $polyfill$jscomp$2$$($i$jscomp$5_orig$$);
  $impl_key$jscomp$37$$ != $i$jscomp$5_orig$$ && null != $impl_key$jscomp$37$$ && $$jscomp$$.defineProperty($obj$jscomp$26$$, $property$jscomp$7_split$$, {configurable:!0, writable:!0, value:$impl_key$jscomp$37$$});
};
$$jscomp$$.polyfillIsolated = function($BIN_ID_isSimpleName_target$jscomp$96$$, $impl$jscomp$1_polyfill$jscomp$3$$, $fromLang$jscomp$2_nativeImpl$$) {
  var $property$jscomp$8_split$jscomp$1$$ = $BIN_ID_isSimpleName_target$jscomp$96$$.split(".");
  $BIN_ID_isSimpleName_target$jscomp$96$$ = 1 === $property$jscomp$8_split$jscomp$1$$.length;
  var $ownerObject_root$jscomp$3$$ = $property$jscomp$8_split$jscomp$1$$[0];
  $ownerObject_root$jscomp$3$$ = !$BIN_ID_isSimpleName_target$jscomp$96$$ && $ownerObject_root$jscomp$3$$ in $$jscomp$$.polyfills ? $$jscomp$$.polyfills : $$jscomp$$.global;
  for (var $i$jscomp$6$$ = 0; $i$jscomp$6$$ < $property$jscomp$8_split$jscomp$1$$.length - 1; $i$jscomp$6$$++) {
    var $key$jscomp$38$$ = $property$jscomp$8_split$jscomp$1$$[$i$jscomp$6$$];
    if (!($key$jscomp$38$$ in $ownerObject_root$jscomp$3$$)) {
      return;
    }
    $ownerObject_root$jscomp$3$$ = $ownerObject_root$jscomp$3$$[$key$jscomp$38$$];
  }
  $property$jscomp$8_split$jscomp$1$$ = $property$jscomp$8_split$jscomp$1$$[$property$jscomp$8_split$jscomp$1$$.length - 1];
  $fromLang$jscomp$2_nativeImpl$$ = $$jscomp$$.IS_SYMBOL_NATIVE && "es6" === $fromLang$jscomp$2_nativeImpl$$ ? $ownerObject_root$jscomp$3$$[$property$jscomp$8_split$jscomp$1$$] : null;
  $impl$jscomp$1_polyfill$jscomp$3$$ = $impl$jscomp$1_polyfill$jscomp$3$$($fromLang$jscomp$2_nativeImpl$$);
  null != $impl$jscomp$1_polyfill$jscomp$3$$ && ($BIN_ID_isSimpleName_target$jscomp$96$$ ? $$jscomp$$.defineProperty($$jscomp$$.polyfills, $property$jscomp$8_split$jscomp$1$$, {configurable:!0, writable:!0, value:$impl$jscomp$1_polyfill$jscomp$3$$}) : $impl$jscomp$1_polyfill$jscomp$3$$ !== $fromLang$jscomp$2_nativeImpl$$ && (void 0 === $$jscomp$$.propertyToPolyfillSymbol[$property$jscomp$8_split$jscomp$1$$] && ($BIN_ID_isSimpleName_target$jscomp$96$$ = 1e9 * Math.random() >>> 0, $$jscomp$$.propertyToPolyfillSymbol[$property$jscomp$8_split$jscomp$1$$] = 
  $$jscomp$$.IS_SYMBOL_NATIVE ? $$jscomp$$.global.Symbol($property$jscomp$8_split$jscomp$1$$) : $$jscomp$$.POLYFILL_PREFIX + $BIN_ID_isSimpleName_target$jscomp$96$$ + "$" + $property$jscomp$8_split$jscomp$1$$), $$jscomp$$.defineProperty($ownerObject_root$jscomp$3$$, $$jscomp$$.propertyToPolyfillSymbol[$property$jscomp$8_split$jscomp$1$$], {configurable:!0, writable:!0, value:$impl$jscomp$1_polyfill$jscomp$3$$})));
};
$$jscomp$$.getConstructImplementation = function() {
  function $reflectConstructWorks$$() {
    function $Base$$() {
    }
    new $Base$$;
    Reflect.construct($Base$$, [], function() {
    });
    return new $Base$$ instanceof $Base$$;
  }
  if ($$jscomp$$.TRUST_ES6_POLYFILLS && "undefined" != typeof Reflect && Reflect.construct) {
    if ($reflectConstructWorks$$()) {
      return Reflect.construct;
    }
    var $brokenConstruct$$ = Reflect.construct;
    return function($out_target$jscomp$97$$, $argList$jscomp$2$$, $opt_newTarget$$) {
      $out_target$jscomp$97$$ = $brokenConstruct$$($out_target$jscomp$97$$, $argList$jscomp$2$$);
      $opt_newTarget$$ && Reflect.setPrototypeOf($out_target$jscomp$97$$, $opt_newTarget$$.prototype);
      return $out_target$jscomp$97$$;
    };
  }
  return function($target$jscomp$98$$, $argList$jscomp$3$$, $obj$jscomp$27_opt_newTarget$jscomp$1$$) {
    void 0 === $obj$jscomp$27_opt_newTarget$jscomp$1$$ && ($obj$jscomp$27_opt_newTarget$jscomp$1$$ = $target$jscomp$98$$);
    $obj$jscomp$27_opt_newTarget$jscomp$1$$ = $$jscomp$$.objectCreate($obj$jscomp$27_opt_newTarget$jscomp$1$$.prototype || Object.prototype);
    return Function.prototype.apply.call($target$jscomp$98$$, $obj$jscomp$27_opt_newTarget$jscomp$1$$, $argList$jscomp$3$$) || $obj$jscomp$27_opt_newTarget$jscomp$1$$;
  };
};
$$jscomp$$.construct = {valueOf:$$jscomp$$.getConstructImplementation}.valueOf();
$$jscomp$$.underscoreProtoCanBeSet = function() {
  var $x$jscomp$88$$ = {a:!0}, $y$jscomp$73$$ = {};
  try {
    return $y$jscomp$73$$.__proto__ = $x$jscomp$88$$, $y$jscomp$73$$.a;
  } catch ($e$jscomp$7$$) {
  }
  return !1;
};
$$jscomp$$.setPrototypeOf = $$jscomp$$.TRUST_ES6_POLYFILLS && "function" == typeof Object.setPrototypeOf ? Object.setPrototypeOf : $$jscomp$$.underscoreProtoCanBeSet() ? function($target$jscomp$99$$, $proto$jscomp$4$$) {
  $target$jscomp$99$$.__proto__ = $proto$jscomp$4$$;
  if ($target$jscomp$99$$.__proto__ !== $proto$jscomp$4$$) {
    throw new TypeError($target$jscomp$99$$ + " is not extensible");
  }
  return $target$jscomp$99$$;
} : null;
$$jscomp$$.inherits = function($childCtor$$, $parentCtor$$) {
  $childCtor$$.prototype = $$jscomp$$.objectCreate($parentCtor$$.prototype);
  $childCtor$$.prototype.constructor = $childCtor$$;
  if ($$jscomp$$.setPrototypeOf) {
    var $p_setPrototypeOf$$ = $$jscomp$$.setPrototypeOf;
    $p_setPrototypeOf$$($childCtor$$, $parentCtor$$);
  } else {
    for ($p_setPrototypeOf$$ in $parentCtor$$) {
      if ("prototype" != $p_setPrototypeOf$$) {
        if (Object.defineProperties) {
          var $descriptor$jscomp$2$$ = Object.getOwnPropertyDescriptor($parentCtor$$, $p_setPrototypeOf$$);
          $descriptor$jscomp$2$$ && Object.defineProperty($childCtor$$, $p_setPrototypeOf$$, $descriptor$jscomp$2$$);
        } else {
          $childCtor$$[$p_setPrototypeOf$$] = $parentCtor$$[$p_setPrototypeOf$$];
        }
      }
    }
  }
  $childCtor$$.superClass_ = $parentCtor$$.prototype;
};
$$jscomp$$.polyfill("Reflect", function($orig$jscomp$1$$) {
  return $orig$jscomp$1$$ ? $orig$jscomp$1$$ : {};
}, "es6", "es3");
$$jscomp$$.polyfill("Reflect.construct", function() {
  return $$jscomp$$.construct;
}, "es6", "es3");
$$jscomp$$.polyfill("Reflect.setPrototypeOf", function($orig$jscomp$3$$) {
  if ($orig$jscomp$3$$) {
    return $orig$jscomp$3$$;
  }
  if ($$jscomp$$.setPrototypeOf) {
    var $setPrototypeOf$jscomp$1$$ = $$jscomp$$.setPrototypeOf;
    return function($target$jscomp$100$$, $proto$jscomp$5$$) {
      try {
        return $setPrototypeOf$jscomp$1$$($target$jscomp$100$$, $proto$jscomp$5$$), !0;
      } catch ($e$jscomp$8$$) {
        return !1;
      }
    };
  }
  return null;
}, "es6", "es5");

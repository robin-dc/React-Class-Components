import React from 'react';
import { useEffect } from 'react';
import { useRef } from 'react';
import { useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

function TransitionItem({result, selectName}) {
  const nodeRef = useRef()

  return (
    <CSSTransition
      nodeRef={nodeRef}
      classNames="result"
      timeout={{ enter: 500, exit: 300 }}
    >
      <li ref={nodeRef} className="nameLi" onClick={selectName}>
        {result}
      </li>
    </CSSTransition>
   );
}

function Autocomplete({names}) {
  const [inputVal, setInputVal] = useState('')
  const [showList, setShowList] = useState(false)
  const inputRef = useRef()

  useEffect(() => {
    if(showList) {
      document.addEventListener('click', handleOutsideClick);
    }

    return () => {
      console.log("Cleaning up event listener from Autocomplete!");
      document.removeEventListener('click', handleOutsideClick);
    }
  }, [showList])

  const handleInput = (e) => {
    setInputVal(e.target.value);
  }

  const selectName = e => {
    e.stopPropagation();
    setInputVal(e.target.innerHTML);
    setShowList(false)
  }

  const handleOutsideClick = () => {
    // Leave dropdown visible as long as input is focused
    if (document.activeElement === inputRef.current) return;
    else setShowList(false);
  }

  const matches = () => {
    const inputLength = inputVal.length;

    if (inputLength === 0) return names;

    const filteredNames = names.filter((name) =>
      name.toLowerCase().includes(inputVal.toLowerCase())
    );

    if (filteredNames.length === 0) {
      filteredNames.push('No matches');
    }
    return filteredNames;
  }

  const results = matches().map((result) => {
    return (
      <TransitionItem key={result} result={result} selectName={selectName}/>
    )
  });

  return (
    <section className="autocomplete-section">
      <h1>Autocomplete</h1>
      <div className="auto">
        <input
          placeholder="Search..."
          ref={inputRef}
          onChange={handleInput}
          value={inputVal}
          onFocus={() => setShowList(true)}
        />
        {showList && (
          <ul className="auto-dropdown">
            <TransitionGroup >
              {results}
            </TransitionGroup>
          </ul>
        )}
      </div>
    </section>
   );
}
export default Autocomplete;

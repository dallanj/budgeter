import './App.css';
import { useEffect, useImperativeHandle, useState } from 'react';
import firebase from './firebase';
import raw from './list.txt';
import { createPortal } from 'react-dom';


function App() {

  // welcome wizard
  const [wizard, setWizard] = useState('');
  const [user, setUser] = useState('');
  const [importUid, setImportUid] = useState('');

  // income stuff
  const [incomes, setIncome] = useState([]);
  const [userInputIncome, setUserInputIncome] = useState({
    description: "",
    amount: "",
    date: "",
    type: ""   
  });
  const [totalIncome, setTotalIncome] = useState(0);

  // expense stuff
  const [expenses, setExpense] = useState([]);
  const [userInputExpense, setUserInputExpense] = useState({
      description: "",
      amount: "",
      date: "",
      type: ""
  });
  const [totalExpense, setTotalExpense] = useState(0);

  // total savings
  const [totalSavings, setTotalSavings] = useState(0);

  // function to create a unique uid
  const uid = function(){
    return 'budgeter-' + Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  /*
  local storage properies
  -> set userId to a uid generated with uid function if not created already
  -> set welcomeWizard to 'on' when site first initializes
    -> when the user finishes the wizard then welcomeWizard is set to 'off'
  -> during the welcome wizard set up we set username to 'user' until the user
     inputs a username of their choice
  */

  // set new userId to localstorage only if there isnt already a userId
  if(!localStorage.getItem("userId")) {
    // Generate new id 
    const userId = uid();

    // using localstorage will set a unique userId to be used for a unique user experience
    localStorage.setItem("userId", userId);

    console.log(userId.length)
  }
  // store userId in a variable for later use
  const userId = localStorage.getItem("userId");

  // set new welcomeWizard property to localstorage only if there isnt already one
  if(!localStorage.getItem("welcomeWizard")) {

    // for better user experience we will create a welcome wizard
    localStorage.setItem("welcomeWizard", 'off');
  }
  // store welcomeWizard in a variable for later use
  const welcomeWizard = localStorage.getItem("welcomeWizard");

  // set new userId to localstorage only if there isnt already a cartId
  if(!localStorage.getItem("budgeterUser")) {

    // using localstorage will set a unique userId to be used for a unique user experience
    localStorage.setItem("budgeterUser", 'Stranger');
  }
  // store userId in a variable for later use
  const username = localStorage.getItem("budgeterUser");

  

  

  useEffect(() => {

    // make ref to database
    const dbRef = firebase.database().ref();

    dbRef.on('value', (response) => {

      // variables to store new state
      const newIncome = [];
      const arrayOfIncomes = [];
      let sumIncome = 0;

      const newExpense = [];
      const arrayOfExpenses = [];
      let sumExpense = 0;

      const data = response.val();
      if(data == null) {
        data = [];
      }

      // iterate through database data where index = userId
        for(let property in data[userId]) {

          console.log(data[userId][property].type)
          if(data[userId][property].type == 'income') {
            arrayOfIncomes.push(parseInt(data[userId][property].amount));
          }
          else if(data[userId][property].type == 'expense')
          {
            arrayOfExpenses.push(parseInt(data[userId][property].amount));
          }

          // push to newIncome array if income
          if(data[userId][property].type === 'income') {
            newIncome.push({
              id: property,
              type: data[userId][property].type,
              date: data[userId][property].date,
              description: data[userId][property].description,
              amount: data[userId][property].amount
          })

          // push to newExpense array if expense
          } else {
            newExpense.push({
              id: property,
              type: data[userId][property].type,
              date: data[userId][property].date,
              description: data[userId][property].description,
              amount: data[userId][property].amount
            })
          }      
        }

        // for array of incomes
        for (let i = 0; i < arrayOfIncomes.length; i++) {
          sumIncome += arrayOfIncomes[i]
        }
        setTotalIncome(sumIncome);
        setIncome(newIncome);

        // for array of expenses
        for (let i = 0; i < arrayOfExpenses.length; i++) {
          sumExpense += arrayOfExpenses[i]
        }
        setTotalExpense(sumExpense);
        setExpense(newExpense);

        // total sums of income and expenses
        setTotalSavings(sumIncome - sumExpense);

    }) 

  }, []);

  const removeRow = (whatToRemove) => {
    // make connection to db
    const dbRef = firebase.database().ref(`/${userId}`);
    
    // use new firebase method to remove an item
    dbRef.child(whatToRemove).remove();
  }


  const addIncome = (event) => {
    event.preventDefault();
    
    // make db connection
    const dbRef = firebase.database().ref(`/${userId}`);

    // create a timestamp
    const currentDate = new Date();
    const cDay = currentDate.getDate();
    const cMonth = currentDate.getMonth() + 1;
    const cYear = currentDate.getFullYear();

    // push income to db
    dbRef.push(userInputIncome);

    // clear the inputs
    setUserInputIncome({
      description: "",
      amount: "",
      date: "",
      type: "" 
    });
  }

  const addExpense = (event) => {
    event.preventDefault();
    
    // make db connection
    const dbRef = firebase.database().ref(`/${userId}`);

    // create a timestamp
    const currentDate = new Date();
    const cDay = currentDate.getDate();
    const cMonth = currentDate.getMonth() + 1;
    const cYear = currentDate.getFullYear();

    // push expense to db only if properties are not empty
    if(userInputExpense.type === 'expense') {
      dbRef.push(userInputExpense);
    } else {
      console.log('poopo ')
    }

    // clear the inputs
    setUserInputExpense({
      description: "",
      amount: "",
      date: "",
      type: "" 
    });
  }




  const handleIncomeChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    // store data passed from add button
    const type = 'income';
    
    // create a timestamp
    const currentDate = new Date();
    const cDay = currentDate.getDate();
    const cMonth = currentDate.getMonth() + 1;
    const cYear = currentDate.getFullYear();

    // set the data to userInputIncome
    setUserInputIncome({
      ...userInputIncome,
      type: type,
      date: `${cDay}/${cMonth}/${cYear}`,
      [name]: value,
    })

  }

  const handleExpenseChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    // store data passed from add button
    const type = 'expense';
    
    // create a timestamp
    const currentDate = new Date();
    const cDay = currentDate.getDate();
    const cMonth = currentDate.getMonth() + 1;
    const cYear = currentDate.getFullYear();

    // set the data to userInputIncome
    setUserInputExpense({
      ...userInputExpense,
      type: type,
      date: `${cDay}/${cMonth}/${cYear}`,
      [name]: value,
    })
  }

  // handle submit for adding income or expense
  const handleSubmit = (event) => {
    event.preventDefault();
    
    // make db connection
    const dbRef = firebase.database().ref(`/${userId}`);

    if(event.target[1].value == 'income') {
      dbRef.child(event.target[0].value).push(userInputIncome);
      console.log('its an income')
    }
    else if(event.target[1].value == 'expense')
    {
      dbRef.child(event.target[0].value).push(userInputExpense);
      console.log('its an expense')
    }
  }

  // update the username field in the welcome wizard
  const handleUserChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    // set the data to user
    setUser(value);
  }

  // handle submit for adding a username
  const handleUserSubmit = (event) => {
    event.preventDefault();

    // check for errors within the wizard
    let errorCheck = 'false';

    // initiate the items array to avoid errors
    // let items = [];

    // fetch the imported profanity list >:)
    fetch(raw)
    .then(r => r.text())
    .then(text => {
      
      // create an items array which adds each word by new line
      const items = text.split("\n")

      // check if username contains a bad word
      if(items.indexOf(user) >= 0 || user.trim() == '') {
        // create error message and exit since we found a bad word
        errorCheck = 'true';
        setError('name', 'usernameLabel', 'username', 'No naughty words pal, nice try')
      }
      // else  // set the username to localstorage if there is no profanity
      // {
      //   errorCheck = 'false';
      // }

      // if there are no errors (username doesn't contain profanity)
      if(errorCheck === 'false') {
        localStorage.setItem("budgeterUser", user);

        // set the importUid if not an empty string
        if(importUid.trim() != '' && importUid.length === 28) {
          localStorage.setItem("userId", importUid);
        }

        // set the data to user
        setWizard('off');

        // set the welcome wizard to 'off'
        if(errorCheck === 'false') {
          localStorage.setItem("welcomeWizard", 'off');

          // set the data to user
          window.location.reload(true)
        }
      }

    });
    
  }

    // import an existing uid field in the welcome wizard
    const handleImportUid = (event) => {
      const target = event.target;
      const value = target.value;
      const name = target.name;
  
      // set the data to user
      setImportUid(value);
    }

    function setError(firstId, secondId, thirdId, message) {
      // remove existing error
      const div = document.getElementById(firstId);
      secondId = document.getElementById(secondId);
      thirdId = document.getElementById(thirdId);

      /* 
      to avoid any duplicates im checking if an error is present 
      on the page by checking the document if the class of errorMsg exists
      */
      if(!document.getElementsByClassName('errorMsg').length) {
        thirdId.style.background = '#fbe7f0'

        // since im using 2 grid columns, I need an empty div below the label
        const emptyNode = document.createElement("div");
  
        // create div which will contain the error
        const node = document.createElement("div");
        node.classList.add('errorMsg');
  
        node.innerText = message;
  
        // append message to new node and append node to parent
        document.getElementById(firstId).appendChild(emptyNode); 
        document.getElementById(firstId).appendChild(node);
      } 
  }

  function unsetError(firstId, secondId) {
    const div = document.getElementById(firstId);

    /*
        if div has more than 1 child
        child[0] is the input
        anything greater needs to be removed
        and background of the input needs to changed back to non error state
    */
    if(div.children.length > 1) {
        div.removeChild(div.lastChild);
    }
    secondId.style.background = '#f6f6f6';
}

  return (
    <div className="App">

      {
        welcomeWizard === 'on' ? (
          <>
          {/* Welcome Wizard Configuration */}

          {/* Welcome wizard background overlay */}
          <div className="wizardOverlay"></div>
          
          {/* Welcome wizard menu */}
          <div className="wizardMenu">
            <h2 className="wizard">Welcome to Budgeter!</h2>

            <p className="wizardopac">
              Greetings, <span className="italic bold">stranger</span>!
            </p>

            <p className="wizardopac">
              Within the toolbox menu you have the option to either add an income or expense to your budget sheet by simply filling out one of the forms with a description and an amount followed by clicking <span className="italic bold">"Add income"</span> or <span className="italic bold">"Add expense"</span>
            </p>

            <p className="wizardopac">
              The summary menu will summarize and calculate your <span className="italic bold">total savings</span> by taking your total income and subtracting your expenses to give you the final balance.
            </p>

            <p className="wizardopac">
              Pretty straight forward, right? Before we begin tracking our finances, let us know what your prefered name is!
            </p>

            <form onSubmit={handleUserSubmit}>

              <div className="grid opac">
                <div className="italic">Items with (*) are required</div>
                <div></div>
              </div>

              <div id="name" className="grid twohalf wizardopac">
                <label id="usernameLabel" for="username"><span className="bold">Prefered name (*)</span></label>
                <input className="wizardInput" id="username" name="username" type="text" value={user} onChange={handleUserChange} placeholder="Username"></input>
              </div>

              <div className="grid twohalf wizardopac">
                <label for="importUid"><span className="bold">Import existing Budgeter ID</span></label>
                <input className="wizardInput" id="importUid" name="importUid" type="text" value={importUid} onChange={handleImportUid} placeholder="budgeter-kwcot6uzyz41njxvwkn"></input>
              </div>

              <div className="grid three">
                <div></div>
                <div></div>
                <button className="wizardButton bold">Finish</button>
              </div>

            </form>
          </div>
          </>
        ) : (
          <div></div>
        )
      }

      
      
      
      <h2 className="greeting">Hi {username} 👋</h2>

      {
        welcomeWizard === 'on' ? (
          <h1 className="greeting">Welcome to Budgeter!</h1>
        ) : (
          <h1 className="greeting">Welcome back to Budgeter!</h1>
        )
      }

      <main className="row">
        <div className="table settings">
          <h2 className="top">Toolbox</h2>

          <div className="grid one">

            {/* row 1 */}
            <div>
              <div className="toolboxForm" onSubmit={addIncome}>
                <div className="color bold">Description</div>
                <div className="color bold">Amount ($)</div>
                <div></div>
              </div>
            </div>

            {/* row 2 */}
            <div>
              <form className="toolboxForm" onSubmit={addIncome}>
                {/* <label for="description">Description</label> */}
                <input className="inputField" type="text" id="description" name="description" value={userInputIncome.description} onChange={handleIncomeChange} placeholder="Paycheck"></input>
                <input className="inputField" type="integer" id="amount" name="amount" value={userInputIncome.amount} onChange={handleIncomeChange} placeholder="0"></input>
                <button className="actionButton" value='income' id="newIncome">Add income</button>
              </form>
            </div>

            {/* row 3 */}
            <div>
              <form className="toolboxForm" onSubmit={addExpense}>
                <input className="inputField" type="text" id="description" name="description" value={userInputExpense.description} onChange={handleExpenseChange} placeholder="Rent"></input>
                <input className="inputField" type="integer" id="amount" name="amount" value={userInputExpense.amount} onChange={handleExpenseChange} placeholder="0"></input>
                <button className="actionButton" value='expense' id="newExpense">Add expense</button>
              </form>
            </div>

          </div>
      

        </div>

        <div className="table settings">
          <h2 className="top">Summary</h2>

          <div className="grid two">

            {/* row 1 */}
            <div className="color bold">Income</div>
            <div className="color">{totalIncome}</div>

            {/* row 2 */}
            <div className="color bold">Expense</div>
            <div className="color">{totalExpense}</div>

            {/* row 2 */}
            <div class="break"></div>
            <div class="break"></div>

            {/* row 3 */}
            <div className="color bold">Total savings</div>
            
              {
                totalSavings <= 0 ? (
                  <div className="negative">${totalSavings}</div>
                ) : (
                  <div className="positive">${totalSavings}</div>  
                )
              }
            

          </div>

        </div>
      </main>

      {/* display income data */}
      <section className="row">

        <div>
          <fieldset>
            <legend>
              {/* section title */}
              <h2 className="bottom">Incomes <span className="span">total ${totalIncome}</span></h2>
            </legend>
          
            {/* table titles */}
            <div className="header grid four">
                <div className="title">Date</div>
                <div className="title">Description</div>
                <div className="title">Amount ($)</div>
                <div></div>
            </div>

            {
              incomes.map((income) => {
                return (
                  <form onSubmit={handleSubmit}>
                    <div className="item grid four">
                        <div>{income.date}</div>
                        <div>{income.description}</div>
                        <div>{income.amount}</div>
                        <div><button className="changeButton" onClick={ () => removeRow(income.id) }><i className="fas fa-times"></i></button></div>
                    </div>
                  </form>
                )
              })
            }

          </fieldset>          
        </div>

        

        <div>
          <fieldset>
            <legend>
              {/* section title */}
              <h2 className="bottom">Expenses <span className="span">total ${totalExpense}</span></h2>
            </legend>

            {/* table titles */}
            <div className="header grid four">
                <div className="title">Date</div>
                <div className="title">Description</div>
                <div className="title">Amount ($)</div>
                <div></div>
            </div>
          
            {
              expenses.map((expense) => {
                return (
                  <form onSubmit={handleSubmit}>
                    <div className="item grid four">
                        <div>{expense.date}</div>
                        <div>{expense.description}</div>
                        <div>{expense.amount}</div>
                        <div><button className="changeButton" onClick={ () => removeRow(expense.id) }><i className="fas fa-times"></i></button></div>
                    </div>
                  </form>
                )
              })
            }
          </fieldset>
        </div>

      </section>

      
    </div>
  );
}

export default App;
// setTotalIncome((totalIncome) => {
//   // return the way in which we wish to update state
//   return totalIncome + parseInt(data[userId][property].amount)
// })
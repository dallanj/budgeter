import './App.css';
import { useEffect, useImperativeHandle, useState } from 'react';
import firebase from './firebase.js';
import { createPortal } from 'react-dom';


function App() {
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
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
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
    localStorage.setItem("budgeterUser", 'User');
  }
  // store userId in a variable for later use
  const username = localStorage.getItem("budgeterUser");

  

  

  useEffect(() => {
    // make ref to database
    const dbRef = firebase.database().ref();

    dbRef.on('value', (response) => {
      // console.log(response.val());

      // var to store new state
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
      // console.log(data[userId])

      // console.log('hasd')
      // calculate sum total income

      // console.log(data[userId]['-Mop_uub7svdqp5KjZx1'].amount)
      // if(typeof data[userId] !== null) {
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
              // const amountInt = parseInt(data[userId][property].amount)
              // // console.log('is it num or string')
              // // console.log(typeof poop)
              
              // setTotalIncome(totalIncome + amountInt)
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
        
            

        
              // in order to control for the async nature of the state updater function, you can pass in a callback function
                  //use the MOST recent value of state FIRST before moving on to a subsequent value
              
        
          
        
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

  const handleSubmit = (event) => {
    event.preventDefault();
    
    // console.log('below is target')
    // console.log(event.target[1].value);
    // console.log(event.target[4].value)
    // make db connection
    const dbRef = firebase.database().ref(`/${userId}`);

    if(event.target[1].value == 'income') {
      dbRef.child(event.target[0].value).push(userInputIncome);
      console.log('its an income')

      // setTotalIncome(totalIncome+parseInt(event.target[4].value))
      
      // setTotalIncome(totalIncome+)
    }
    else if(event.target[1].value == 'expense')
    {
      dbRef.child(event.target[0].value).push(userInputExpense);
      console.log('its an expense')
    }

    // old shit that works DONT FUCK IT UP
    // if(event.target[1].value == 'income') {
    //   dbRef.child(event.target[0].value).set(userInputIncome);
    //   console.log('its an income')

    //   setTotalIncome(totalIncome+parseInt(event.target[4].value))
      
    //   // setTotalIncome(totalIncome+)
    // }
    // else if(event.target[1].value == 'expense')
    // {
    //   dbRef.child(event.target[0].value).set(userInputExpense);
    //   console.log('its an expense')
    // }

    // console.log('below is contents of userInputIncome')
    // console.log(userInputIncome);

    

    // store data passed from add button
    // const type = event.target.value;
    // const key = uid();

    // // create a timestamp
    // const currentDate = new Date();
    // const cDay = currentDate.getDate();
    // const cMonth = currentDate.getMonth() + 1;
    // const cYear = currentDate.getFullYear();

    // if(type === 'income') {
      
    // } 
    // else {
    //   dbRef.update({
    //     // id: `expense${key}`,
    //     type: type,
    //     date: `${cDay}/${cMonth}/${cYear}`,
    //     description: "description",
    //     amount: "0"
    //    });
    // }
    

  }

  // console.log(incomes);

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
            <h1 className="wizard">Welcome to Budgeter!</h1>
          </div>
          </>
        ) : (
          <div>s</div>
        )
      }

      
      
      
      <h2 className="greeting">Hi {username} 👋</h2>
      <h1 className="greeting">Welcome back to Budgeter!</h1>

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

            {/* row 3 */}
            {/* <div>
              <form onSubmit={addRecord}>
                <button className="actionButton" value='income' onClick={addRecord} id="newIncome">Add income</button>
              </form>
            </div>
            <div>
              <form onSubmit={addRecord}>
                <button className="actionButton" value='expense' onClick={addRecord} id="newExpense">Add expense</button>
              </form>
            </div>
            <div></div> */}

          </div>

          
        {/* <label htmlFor="newBook">Add a new book to the shelf</label> */}
        {/* <input id="value="income" type="text"/> */}
        
        
        {/* <button value='expense' onClick={addRecord} id="newExpense">Add expense</button> */}
      
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

        {/* <div> */}

          {/* display expense data */}
          {/* <h2 className="bottom">Expense</h2>
            {
              
              expenses.map((expense) => {
                return (
                  <form onSubmit={handleSubmit}>
                    <div className="flex">
                        <input hidden id="type" type="text" name="id" value={userInputExpense.id = expense.id} onChange={handleExpenseChange} />
                        <input hidden id="type" type="text" name="type" value={userInputExpense.type = expense.type} onChange={handleExpenseChange} />
                        <div><input disabled id="date" type="text" name="date" value={userInputExpense.date = expense.date} onChange={handleExpenseChange} /></div>
                        <div><input id="description" type="text" name="description" value={userInputExpense.description} onChange={handleExpenseChange} /></div>
                        newIncome works but i need to name it amount
                        <div><input id="amount" type="text" name="amount" value={userInputExpense.amount} onChange={handleExpenseChange} /></div>
                        <div><button className="changeButton"><i className="fas fa-check"></i></button></div>
                        <div><button className="changeButton" onClick={ () => removeRow(expense.id) }><i className="fas fa-times"></i></button></div> 
                      <button onClick={ () => removeBook(Expense.incomeId) }>remove book</button>
                    </div>
                  </form>
                )
              })
            }
          </div> */
          }

      </section>

      
    </div>
  );
}

export default App;
// setTotalIncome((totalIncome) => {
//   // return the way in which we wish to update state
//   return totalIncome + parseInt(data[userId][property].amount)
// })
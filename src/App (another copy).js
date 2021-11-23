import './App.css';
import { useEffect, useState } from 'react';
import firebase from './firebase.js';


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
    // "poop": {
    //   description: "",
    //   amount: "",
    //   date: "",
    //   type: ""
    // }
    
      description: "",
      amount: "",
      date: "",
      type: ""
  });
  const [totalExpense, setTotalExpense] = useState('');

  const uid = function(){
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // set new userId to localstorage only if there isnt already a cartId
  if(!localStorage.getItem("userId")) {
    // Generate new id 
    const userId = uid();

    // using localstorage will set a unique userId to be used for a unique user experience
    localStorage.setItem("userId", userId);
  }
  // store userId in a variable for later use
  const userId = localStorage.getItem("userId");

  

  

  useEffect(() => {
    // make ref to database
    const dbRef = firebase.database().ref();

    dbRef.on('value', (response) => {
      // console.log(response.val());

      // var to store new state
      const newIncome = [];
      const newExpense = [];
      
      const arrayOfIncomes = [];
      let sumIncome = 0;

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

          // console.log('this is amount:')
          // console.log(data[userId][property].amount)
          arrayOfIncomes.push(parseInt(data[userId][property].amount));
          //   console.log('is it num or string')
          //   console.log()
            
            
          //   console.log('this is sumIncome:')
          // console.log(sumIncome)

          // remove later
          // console.log(`${property}: ${data[userId][property].amount}`);
          
          //testing this today nov 22
          // newIncome.push({
          //   description: data[property].desc,
          //   amount: data[property].amount
          // })
          
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
        for (let i = 0; i < arrayOfIncomes.length; i++) {
          sumIncome += arrayOfIncomes[i]
        }
      
        setTotalIncome(sumIncome)
      setIncome(newIncome);
      setExpense(newExpense);
      
    })


    

  }, []);

  const removeRow = (whatToRemove) => {
    // make connection to db
    const dbRef = firebase.database().ref(`/${userId}`);
    
    // use new firebase method to remove an item
    dbRef.child(whatToRemove).remove();
  }


  const addRecord = (event) => {
    event.preventDefault();
    
    // setuserInputIncome(event.target.value);

    // make db connection
    const dbRef = firebase.database().ref(`/${userId}`);

    // store data passed from add button
    const type = event.target.value;
    const key = uid();

    // create a timestamp
    const currentDate = new Date();
    const cDay = currentDate.getDate();
    const cMonth = currentDate.getMonth() + 1;
    const cYear = currentDate.getFullYear();

    console.log('below is WHAT WE WANNA PUSH')
    // console.log(event.target[1].value);
    console.log(event.target.value)

    if(type === 'income') {
      const newIncome = dbRef.push({
        // id: `income${key}`,
        type: type,
        date: `${cDay}/${cMonth}/${cYear}`,
        description: "description",
        amount: "0"
       });
    } else {
      const newExpense = dbRef.push({
        // id: `expense${key}`,
        type: type,
        date: `${cDay}/${cMonth}/${cYear}`,
        description: "description",
        amount: "0"
       });
    }
    

    

  }




  const handleIncomeChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    const valueInt = parseFloat(event.target.value)
    // console.log('below is name')
    // console.log(event.target.value);

    // console.log('below is typeof')
    // console.log(typeof valueInt)


    // setTotalIncome(totalIncome + valueInt)
    // console.log('below is totalincome')
    // console.log(totalIncome)
    // const idd = '-Mp9QOw4wvtS3wu2FqvJ'
    // const idd = event.target[0].value;

    
    // setuserInputIncome({
    //   ...userInputIncome,
    //   [name]: value
    // });

    // setuserInputIncome({
    //   "poop23": {
    //     ...userInputIncome,
    //     [name]: value,
    //   }
      setUserInputIncome({
      // [id]: {
        ...userInputIncome,
        [name]: value,
      // }
        
      

    })

    // console.log(userInputIncome);
  }

  const handleExpenseChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    setUserInputExpense({

        ...userInputExpense,
        [name]: value,
    })

    console.log(userInputIncome);
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    
    console.log('below is target')
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
      
      <h2>Hi Dallan 👋</h2>
      <h1>Welcome back to Budgeter!</h1>

      <main className="row">
        <div className="table settings">
          <h3 className="top">Toolbox</h3>

          <div className="grid one">

            {/* row 1 */}
            <div>
              <form className="flex" onSubmit={handleSubmit}>
                <input type="text" id="description" name="description" value={userInputIncome.description} onChange={handleIncomeChange} placeholder="description"></input>
                <input type="integer" id="amount" name="amount" value={userInputIncome.amount} onChange={handleIncomeChange} placeholder="amount"></input>
                <button className="actionButton" value='income' id="newIncome">Add income</button>
              </form>
            </div>

            {/* row 2 */}
            <div>
              <form>

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
          <h3 className="top">Summary</h3>

          <div className="grid two">

            {/* row 1 */}
            <div>Income</div>
            <div>${totalIncome}</div>

            {/* row 2 */}
            <div>Expense</div>
            <div>$</div>

            {/* row 3 */}
            <div>Total savings</div>
            <div>$</div>

          </div>

        </div>
      </main>

      {/* display income data */}
      <main className="row">

        <div>
          <h3 className="bottom">Income</h3>
          
            {
              
             

              incomes.map((income) => {
                // console.log(incomes.length)
                // console.log('we need to sum the total value of amount incomes');
              
                // setTotalIncome(totalIncome+1)

              // amountToInt = parseInt(income.amount);
              // setTotalIncome(totalIncome + amountToInt);
                return (
                  // if (income.type == 'expense') {
                  //   <p>{income.type}</p>
                  // }
                  // <form onSubmit={updateChanges}>
                  <form onSubmit={handleSubmit}>
                    <div className="flex">
                        <div>{income.id}</div>
                        <div>{income.type}</div>
                        <div>{income.date}</div>
                        <div>{income.description}</div>
                        <div>{income.amount}</div>
                        {/* <div><input disabled id="date" type="text" name="date" value={userInputIncome.date = income.date} onChange={handleIncomeChange} /></div>
                        <div><input id="description" type="text" name="description" value={userInputIncome.description} onChange={handleIncomeChange} /></div> */}
                        {/* newIncome works but i need to name it amount */}
                        <div>{income.amount}</div>
                        {/* <div><input id="amount" type="text" name="amount" value={userInputIncome.amount} onChange={handleIncomeChange} /></div> */}
                        {/* <div><button className="changeButton"><i className="fas fa-check"></i></button></div>
                        <div><button className="changeButton" onClick={ () => removeRow(income.id) }><i className="fas fa-times"></i></button></div>  */}
                      {/* <button onClick={ () => removeBook(income.incomeId) }>remove book</button> */}
                    </div>
                  </form>
                )
              })
            }
          
        </div>

        {/* <div> */}

          {/* display expense data */}
          {/* <h3 className="bottom">Expense</h3>
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

      </main>

      
    </div>
  );
}

export default App;
// setTotalIncome((totalIncome) => {
//   // return the way in which we wish to update state
//   return totalIncome + parseInt(data[userId][property].amount)
// })
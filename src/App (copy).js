import './App.css';
import { useEffect, useState } from 'react';
import firebase from './firebase.js';


function App() {
  const [incomes, setIncome] = useState([]);
  const [expenses, setExpense] = useState([]);
  const [userInput, setUserInput] = useState('');

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

      const data = response.val();

      // console.log(data[userId]['-Mop_uub7svdqp5KjZx1'].amount)
      
      // iterate through database data where index = userId
      for(let property in data[userId]) {

        // remove later
        console.log(`${property}: ${data[userId][property].amount}`);
        
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
    
    // setUserInput(event.target.value);

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




  const handleChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    // console.log(event.target.value);
    const idd = '-Mp9QOw4wvtS3wu2FqvJ'
    // setUserInput({
    //   ...userInput,
    //   [name]: value
    // });

    setUserInput({
      ...userInput,
      [name]: value
    })

    console.log(userInput);
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    
    // setUserInput(event.target.value);

    // make db connection
    const dbRef = firebase.database().ref(`/${userId}`);

    // store data passed from add button
    // const type = event.target.value;
    // const key = uid();

    // // create a timestamp
    // const currentDate = new Date();
    // const cDay = currentDate.getDate();
    // const cMonth = currentDate.getMonth() + 1;
    // const cYear = currentDate.getFullYear();

    // if(type === 'income') {
      dbRef.child('-Mp9QOw4wvtS3wu2FqvJ').set(userInput);
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

      {/* display income data */}
      <h1>Income</h1>
      <ul>
        {
          
          incomes.map((income) => {
            console.log(incomes)
            return (
              // if (income.type == 'expense') {
              //   <p>{income.type}</p>
              // }
              // <form onSubmit={updateChanges}>
              <form onSubmit={handleSubmit}>
                <div class="flex">
                    <div>{income.id}</div>
                    <div>{income.type}</div>
                    <div>{income.date}</div>
                    <div>{income.description}</div>
                    {/* newIncome works but i need to name it amount */}
                    <div><input id="amount" type="text" name="amount" value={userInput.newIncome} onChange={handleChange} /></div>
                    <div><button><i class="fas fa-check"></i></button></div>
                    <div><button onClick={ () => removeRow(income.id) }><i class="fas fa-times"></i></button></div> 
                  {/* <button onClick={ () => removeBook(income.incomeId) }>remove book</button> */}
                </div>
              </form>
            )
          })
        }
      </ul>

      {/* display expense data */}
      <h1>Expense</h1>
      <ul>
        {
          
          expenses.map((expense) => {
            return (
              // if (income.type == 'expense') {
              //   <p>{income.type}</p>
              // }
              <div class="flex">
                <div>{expense.id}</div>
                <div>{expense.type}</div>
                <div>{expense.date}</div>
                <div>{expense.description}</div>
                <div>{expense.amount}</div>
                <div><button><i class="fas fa-check"></i></button></div>
                <div><button onClick={ () => removeRow(expense.id) }><i class="fas fa-times"></i></button></div>
                
                {/* <button onClick={ () => removeBook(income.incomeId) }>remove book</button> */}
              </div>
            )
          })
        }
      </ul>

      <form onSubmit={addRecord}>
        {/* <label htmlFor="newBook">Add a new book to the shelf</label> */}
        {/* <input id="value="income" type="text"/> */}
        <button value='income' onClick={addRecord} id="newIncome">Add income</button>
        <button value='expense' onClick={addRecord} id="newExpense">Add expense</button>
      </form>
    </div>
  );
}

export default App;

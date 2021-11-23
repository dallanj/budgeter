import './App.css';
import { useEffect, useState } from 'react';
import firebase from './firebase.js';


function App() {
  const [incomes, setIncome] = useState([]);
  const [expenses, setExpense] = useState([]);
  const [userInput, setUserInput] = useState({
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

    console.log('belowispoop')
    console.log(event.target);
    // const idd = '-Mp9QOw4wvtS3wu2FqvJ'
    // const idd = event.target[0].value;

    
    // setUserInput({
    //   ...userInput,
    //   [name]: value
    // });

    // setUserInput({
    //   "poop23": {
    //     ...userInput,
    //     [name]: value,
    //   }
      setUserInput({
      // [id]: {
        ...userInput,
        [name]: value,
      // }
        
      

    })

    // console.log(userInput);
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    
    console.log('below is target')
    console.log(event.target[0].value);

    console.log('below is contents of userInput')
    console.log(userInput);

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
      dbRef.child(event.target[0].value).set(userInput);
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

          <div className="grid three">

            {/* row 1 */}
            <div>Viewing month of</div>
            <div>2</div>
            <div>3</div>

            {/* row 2 */}
            <div>During year of</div>
            <div>5</div>
            <div>6</div>

            {/* row 3 */}
            <div>
              <form onSubmit={addRecord}>
                <button className="actionButton" value='income' onClick={addRecord} id="newIncome">Add income</button>
              </form>
            </div>
            <div>
              <form onSubmit={addRecord}>
                <button className="actionButton" value='expense' onClick={addRecord} id="newExpense">Add expense</button>
              </form>
            </div>
            <div></div>

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
            <div>$</div>

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
                console.log(incomes.length)
                return (
                  // if (income.type == 'expense') {
                  //   <p>{income.type}</p>
                  // }
                  // <form onSubmit={updateChanges}>
                  <form onSubmit={handleSubmit}>
                    <div class="flex">
                        <input hidden id="type" type="text" name="type" value={userInput.id = income.id} onChange={handleChange} />
                        <input hidden id="type" type="text" name="type" value={userInput.type = income.type} onChange={handleChange} />
                        <div><input disabled id="date" type="text" name="date" value={userInput.date = income.date} onChange={handleChange} /></div>
                        <div><input id="description" type="text" name="description" value={userInput.description} onChange={handleChange} /></div>
                        {/* newIncome works but i need to name it amount */}
                        <div><input id="amount" type="text" name="amount" value={userInput.amount} onChange={handleChange} /></div>
                        <div><button className="changeButton"><i class="fas fa-check"></i></button></div>
                        <div><button className="changeButton" onClick={ () => removeRow(income.id) }><i class="fas fa-times"></i></button></div> 
                      {/* <button onClick={ () => removeBook(income.incomeId) }>remove book</button> */}
                    </div>
                  </form>
                )
              })
            }
          
        </div>

        <div>

          {/* display expense data */}
          <h3 className="bottom">Expense</h3>
            {
              
              expenses.map((expense) => {
                return (
                  <form onSubmit={handleSubmit}>
                    <div class="flex">
                        <input hidden id="type" type="text" name="type" value={userInput.id = expense.id} onChange={handleChange} />
                        <input hidden id="type" type="text" name="type" value={userInput.type = expense.type} onChange={handleChange} />
                        <div><input disabled id="date" type="text" name="date" value={userInput.date = expense.date} onChange={handleChange} /></div>
                        <div><input id="description" type="text" name="description" value={userInput.description} onChange={handleChange} /></div>
                        {/* newIncome works but i need to name it amount */}
                        <div><input id="amount" type="text" name="amount" value={userInput.amount} onChange={handleChange} /></div>
                        <div><button className="changeButton"><i class="fas fa-check"></i></button></div>
                        <div><button className="changeButton" onClick={ () => removeRow(expense.id) }><i class="fas fa-times"></i></button></div> 
                      {/* <button onClick={ () => removeBook(income.incomeId) }>remove book</button> */}
                    </div>
                  </form>
                )
              })
            }
          </div>

      </main>

      
    </div>
  );
}

export default App;

import axios from 'axios'
import Head from 'next/head'
import { useState } from 'react'
import styles from '../styles/Home.module.scss'

export default function Home({pizzaList}) {
 
  const [ qntSabor, setQntSabor] = useState(1)
  const [ saborPizza, setSaborPizza] = useState([])
  const [isPizzaComplet, setIsPizzaComplet] = useState(false)
  const [ subTotal, setSubTotal] = useState(0)

  function qntSaborPizza(e) {
    if(saborPizza.length == qntSabor && e.target.value < qntSabor) {
      let reduzir = saborPizza
      let count = qntSabor > e.target.value ? qntSabor - e.target.value : 0
      for(let i=0; i<count; i++) {
        reduzir.pop()
      }
    }
    setSubTotal(0)
    setQntSabor(e.target.value)
    setIsPizzaComplet(false)
  }

  function handleSaborChange(sabor, index) {
    if(index < 0)
      return;

    const sabores = saborPizza
    sabores[index] = pizzaList[sabor.target.value]
    setSaborPizza(sabores)
    setIsPizzaComplet(false)
  }

  function montarPizza() {
    if(saborPizza.length < 1 || saborPizza.length < qntSabor)
    return;

    setIsPizzaComplet(true)
    calculoPizza(saborPizza)
  }

  function calculoPizza(saborPizza) {
    let soma = 0
    {saborPizza.map(sabores => {
      soma += sabores.valor / saborPizza.length
      setSubTotal(soma.toFixed(2))
    })}
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Pizza App</title>
      </Head>
      <header className={styles.header}>
        <img src="/logo.png"></img>
        <h1>Bag Pizza</h1>
      </header>
      <main className={styles.main}>
        <div className={styles.cardapio}>
          <div className={styles.listacardapio}>
            {pizzaList.map(cardapio => {
              return (
                <div key={cardapio.id} className={styles.cardapioSabor}>
                  <img src="/pizza.svg"></img>
                  <span>{cardapio.nome}</span>
                  <span>R$ {(cardapio.valor).toFixed(2).replace('.',',')}</span>
                </div>
              )
            })}
          </div>
        </div>
        <div className={styles.wrapper}>
          <div className={styles.pedido}>
            <div className={styles.listagem}>
              <h3>Quantidade de Sabores</h3>
              <select 
                onChange={e => qntSaborPizza(e)}
                name="qntSabor"
                className={styles.selectqntdsabor}
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
              </select>
              
              {qntSabor > 1 ? <h3>Sabores da Pizza</h3> : <h3>Sabor da Pizza</h3>}
              <div className={styles.sabores}>
                <div className={styles.sabor}>
                  <select 
                    onChange={sabor => handleSaborChange(sabor, 0)}
                    name="saborPizza"
                    className={styles.selectsabor}
                  >
                    <option selected disabled hidden>- Selecione o Sabor -</option>
                    {pizzaList.map((pizza, index) => {
                      return (
                        <option key={pizza.id} value={index}>{pizza.nome}</option>
                      )
                    })}
                  </select>
                </div>
                {qntSabor > 1 ? 
                  (
                    <div className={styles.sabor}>
                      <select 
                        onChange={sabor => handleSaborChange(sabor, 1)} 
                        name="saborPizza2"
                        className={styles.selectsabor}
                      >
                        <option selected disabled hidden>- Selecione o Sabor -</option>
                        {pizzaList.map((pizza, index) => {
                          return (
                            <option key={pizza.id} value={index}>{pizza.nome}</option>
                          )
                        })}
                      </select>
                    </div>
                  )
                  :
                  (
                    <>
                    </>
                  )
                }
                {qntSabor > 2 ? 
                  (
                    <div className={styles.sabor}>
                      <select 
                        onChange={sabor => handleSaborChange(sabor, 2)} 
                        name="saborPizza3"
                        className={styles.selectsabor}
                      >
                        <option selected disabled hidden>- Selecione o Sabor -</option>
                        {pizzaList.map((pizza, index) => {
                          return (
                            <option key={pizza.id} value={index}>{pizza.nome}</option>
                          )
                        })}
                      </select>
                    </div>
                  )
                  :
                  (
                    <>
                    </>
                  )
                }
              </div>
              <input type="button" onClick={montarPizza} value="Montar Pizza"/>
            </div>
            <div className={styles.resultado}>
              {isPizzaComplet ? (
                <>
                <h3>Valor do Pedido</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Sabor</th>
                      <div className={styles.linhaVertical}/>
                      <th>Valor</th>
                    </tr>
                  </thead>
                  <tbody>
                      {saborPizza.map(pizza => {
                        return (
                          <>
                            <div className={styles.linha}/>
                            <tr key={pizza.id}>
                              <td>{pizza.nome}</td>
                              <div className={styles.linhaVertical}/>
                              <td>R$ {(pizza.valor/saborPizza.length).toFixed(2).replace('.',',')}</td>
                            </tr>
                          </>
                        )
                      })}
                      <div className={styles.linha}/>
                      <tr>
                        <td>Subtotal</td>
                        <td>R$ {subTotal}</td>
                      </tr>
                  </tbody>
                </table>
                </>
              )
                : (
                <>
                </>
                )
              }
            </div>
          </div>
          <div className={styles.promocoes}>
              <img src="/promocao.jpg"></img>
            </div>
        </div>
      </main>
    </div>
  )
}

export const getStaticProps = async () => {
  const { data } = await axios.get('https://pizzaria.roxo.dev.br/')

  const pizzaList = data.map(pizzas => {
    return {
      id: pizzas.id,
      nome: pizzas.nome,
      valor: Number(pizzas.valor)
    }
  })

  return {
    props: {
      pizzaList
    }
  }

}
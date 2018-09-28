const HV = 1000000000000000
let T = 0,
    TPLL = 0,
    N = 3,
    A = [2,4,7],
    TPS = new Array(N).fill(HV),
    PA = new Array(N).fill(0).map( ( _ , index) => new Array(A[index]).fill(HV) ),
    TF = 50000,
    STO = new Array(N).fill(0),
    ITO = new Array(N).fill(0),
    SLL = new Array(N).fill(0),
    SS = new Array(N).fill(0),
    STA = new Array(N).fill(0),
    NT = new Array(N).fill(0),
    NS = new Array(N).fill(0);

/* i: indice del empleado, j: indice del subpuesto */



let generarRandom = (minimo, maximo) =>{
    let R = 0
    while(R < minimo || R > maximo){
        R= Math.random()
    }
    return R
}

let generarIA = () =>{
    let R = generarRandom(0.0001, 0.99999999)
    resultado = Math.pow(Math.log(1/(1-R)), 1/1.0985) * 33.427
    return resultado
}

let generarTA = (i) =>{
    let R = generarRandom(0.0001, 0.93)
    return 8.2546 * Math.pow( ( ( 1/(Math.pow(1-R, 8.33402)) ) -1), 0.274 )
}

let indiceDelMenor = (array) => {
    let menor = array.reduce((a,b) => Math.min(a,b))
    return array.indexOf(menor)
}

let indiceDelMayor = (array) => {
    let mayor = array.reduce((a,b) => Math.max(a,b))
    return array.indexOf(mayor)
}

let distribucion = () => {
    // let puesto = PA.findIndex( puestos => puestos.some( puesto => puesto === HV) )
    let puesto
    if(!PA.every(puestos => puestos.every(p => p !== HV))){
        let porcentajes_ocupacion = PA.map(puestos => puestos.map(p => (p !== HV)? 1 : 0).reduce((a,b) => a + b) / puestos.length)
        puesto = indiceDelMenor(porcentajes_ocupacion)
    }else{
        puesto = indiceDelMayor(A)
    }
    return puesto
}

let procesarLlegada = () => {
    T = TPLL
    TPLL = T + generarIA()
    let i = distribucion()
    NS[i]++
    if(NS[i] <= A[i]){
        STO[i] += ( PA[i].every( tiempo => tiempo === HV ) )? T - ITO[i] : 0
        let j = PA[i].findIndex( pa => pa === HV)
        let TA = generarTA(i)
        PA[i][j] = T + TA
        STA[i] += TA
        TPS[i] = PA[i][ indiceDelMenor(PA[i]) ]
    }
    SLL[i] += T
    NT[i] ++
}

let procesarSalida = (i) => {
    T = TPS[i]
    NS[i]--
    let j = indiceDelMenor(PA[i])
    if( NS[i] >= A[i] ){
        let TA = generarTA(i)
        PA[i][j] = T + TA
        STA[i] += TA
    } else {
        PA[i][j] = HV
        ITO[i] = T
    }
    TPS[i] = PA[i][indiceDelMenor(PA[i])]
    SS[i] += T
}

let simular = () => {
    let i = indiceDelMenor(TPS)
        if(TPLL <= TPS[i]){
            procesarLlegada()
        }else{
            procesarSalida(i)
        }
    if(T <= TF ){
        simular();
    }else if (NS.some(ns => ns != 0)){
        TPLL = HV
        simular()
    }else{
        PTO = STO.map( sto => sto*100 / T)
        PTE = SS.map((ss, indice) => ( ss - SLL[indice]) / NT[indice] )
        CTEM = A.map( a => (a <= 2)? 30000 : (a <= 4)? 40000: 60000 ).reduce((a,b) => a+b)
        console.log( T)
        NT.forEach( (nt, indice) =>{
            console.log( nt)
        })
        PTO.forEach( (pto, indice) =>{
            console.log( pto)
        })

        PTE.forEach( (pte, indice) =>{
            console.log( pte)
        })
        console.log( CTEM)
        console.log( NT.reduce((a,b) => a+b))
        console.log( PTO.reduce((a,b) => a+b)/ PTO.length)
        console.log( PTE.reduce((a,b) => a+b)/ PTE.length)
    }
}

simular();
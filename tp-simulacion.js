const HV = 1000000000000000
let T = 0,
    TPLL = 0,
    N = 3,
    A = [1,1,4],
    TPS = new Array(N).fill(HV),
    PA = new Array(N).fill(0).map( ( _ , index) => new Array(A[index]).fill(HV) ),
    TF = 10000,
    STO = new Array(N).fill(0),
    ITO = new Array(N).fill(0),
    SLL = new Array(N).fill(0),
    SS = new Array(N).fill(0),
    STA = new Array(N).fill(0),
    NT = new Array(N).fill(0),
    NS = new Array(N).fill(0);

/* i: indice del empleado, j: indice del subpuesto */

let generarIA = () =>{
    return 3
}

let generarRandom = (minimo, maximo) =>{
    let R = 0
    while(R < minimo || R > maximo){
        R= Math.random()
    }
    return R
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
    let puesto = PA.findIndex( puestos => puestos.some( puesto => puesto === HV) )
    return (puesto !== -1)? puesto : indiceDelMayor(A)
}

let procesarLlegada = () => {
    T = TPLL
    TPLL = T + generarIA()
    let i = distribucion()
    NS[i]++
    if(NS[i] <= A[i]){
        STO[i] += ( PA[i].every( tiempo => tiempo === HV ))? 0 : T - ITO[i]
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
    }else if (NS.some((ns, index )=> ns > A[index])){
        TPLL = HV
        simular()
    }else{
        PTO = STO.map( sto => sto*100 / T)
        PTE = SS.map((ss, indice) => ( ss - SLL[indice] - STA[indice]) / NT[indice] )
        CTEM = A.map( a => (a <= 2)? 30000 : (a <= 4)? 40000: 60000 ).reduce((a,b) => a+b)
        console.log('T', T)
        NT.forEach( (nt, indice) =>{
            console.log(`NT ${indice}:`, nt)
        })
        PTO.forEach( (pto, indice) =>{
            console.log(`PTO ${indice}:`, pto)
        })
        PTE.forEach( (pte, indice) =>{
            console.log(`PTE ${indice}:`, pte)
        })
        console.log('CTEM:', CTEM)
    }
}

simular();
import sys
from datetime import datetime

class Kmer:
    def __init__ (self, sequencia):
        self.sequencia = sequencia
        self.k = len(sequencia)
        self.proximos = []
        self.anteriores = []

    def getPrefixo (self):
        return self.sequencia[0:self.k-1]

    def getSufixo (self):
        return self.sequencia[1:self.k]

    def initProxAnter(self, lista):
        for e in lista:
            if self == e: continue
            if e.getPrefixo() == self.getSufixo(): self.proximos.append(e)
            if e.getSufixo() == self.getPrefixo(): self.anteriores.append(e)

    def remontar(self, kmers, solucao, prof):
        if self in solucao: return False
        if prof >= len(kmers): return False
        solucao.append(self)
        if len(self.proximos)==0 and len(kmers) == prof+1:#resposta
            return True
        for k in self.proximos:
            if k.remontar(kmers, solucao, prof+1): return True
            while solucao[-1] != self: solucao.pop()

def lerArquivo(fileName):
    file = open(fileName, 'r')
    kmers = file.readline().split(',')
    file.close()
    lista = []
    for k in kmers:
        lista.append(Kmer(k.strip()))
    return lista

def escreverArquivo(kmers):
    nomeArq = 'dna_remontado_'+datetime.now().strftime("%H-%M-%S")+'.fasta'
    print('Salvando arquivo: ' + nomeArq)
    file = open(nomeArq, 'w')
    file.write(kmers[0].sequencia)
    for k in range(1, len(kmers)):
        file.write(kmers[k].sequencia[-1])
    file.close()

def getInicioFim(lista):
    fim, inicio = None, None
    for e in lista:
        if len(e.proximos) == 0:
            fim = e
        if len(e.anteriores) == 0:
            inicio = e
    return inicio, fim

def solucionar(kmers):
    inicio, fim = getInicioFim(kmers)
    if inicio == None or fim == None: 
        print('Inicio ou Fim não encontrados.')
        return None
    indices = [0] * len(kmers)
    solution = []
    while True:
        solution = []
        solution.append(inicio)
        for i in range(len(kmers)):
            if len(solution[i].proximos) == 0 or (solution[i].proximos[indices[i]] in solution): break
            solution.append(solution[i].proximos[indices[i]])
        if len(solution) == len(kmers):#solução correta obtida
            return solution
        for k in range(len(kmers)-1, -1, -1):
            if len(solution) > k and indices[k] < len(solution[k].proximos)-1:
                indices[k] += 1
                for z in range(k+1, len(kmers)-1):
                    indices[z] = 0
                break
        del(solution[:])

def main(fileName):
    try:
        kmers = lerArquivo(fileName)
    except:
        print('Arquivo não encontrado tente novamente.')
        return
    print('Inicio: ' + datetime.now().strftime("%H:%M:%S"))

    for e in kmers:
        e.initProxAnter(kmers)
    solucao = []
  
    solucao = solucionar(kmers)     

    print('Fim   : ' + datetime.now().strftime("%H:%M:%S"))
    if (len(solucao) == 0):
        print('Não foi possível realizar a remontagem do DNA.')
        return
        
    escreverArquivo(solucao)
    

if len(sys.argv)<2:
    print('Nenhum arquivo inicial proposto!\nExemplo de execução:\npython3 ' + sys.argv[0] + ' k25mer.txt')
    sys.exit()
main (sys.argv[1])
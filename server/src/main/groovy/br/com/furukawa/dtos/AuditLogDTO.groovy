package br.com.furukawa.dtos

class AuditLogDTO {
    def id
    def persistedObjectVersion
    def persistedObjectId
    def actor
    def eventName
    def className
    def dateCreated
    def lastUpdated
    def propertyName
    def oldValue
    def newValue
    Periodo periodo

    static trunkClassName(String className){
        int index = className.lastIndexOf(".")
        return className.substring(index+1)
    }

    def getPeriodo(){
        return periodo ?: new Periodo()
    }
}

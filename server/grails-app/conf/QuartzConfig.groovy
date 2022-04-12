
quartz {
    autoStartup = true
    jdbcStore = true
    waitForJobsToCompleteOnShutdown = true

    props {
        scheduler.skipUpdateCheck = true
    }
}

environments {

    test {
        quartz {
            autoStartup = false
        }
    }
}

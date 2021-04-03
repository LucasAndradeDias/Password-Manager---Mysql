var BtnGenNewPass = document.getElementById("GenNewPassword")
var BtnResPass = document.getElementById("GetPs")
var BtnAddPass = document.getElementById("AddNewPassword")
var BtnChangeOrDelete = document.getElementById("ChangeOrDelete")
var OptsDiv = document.getElementById("DivOpts")

function RemoveContainer(){
    if (document.getElementById('Current-container')){
    document.getElementById('Current-container').remove()
    }
}



// Generate new password


$(BtnGenNewPass).on('click',function(e){
    RemoveContainer()
    e.preventDefault()

    //Container
    var container = document.createElement('div'); container.id = 'Current-container'
    
    //Text Inputs
    var InputTxtDiv = document.createElement("div")
    InputTxtDiv.id = 'DivTxtInputsBtnGenPass'

    var InputSiteApp = document.createElement("input")
    InputSiteApp.type = "text";InputSiteApp.placeholder = "Site or App name";

    var InputRange = document.createElement("input")
    InputRange.type = "number";InputRange.placeholder = "Range";InputRange.max = 10;InputRange.min = 2


    var BasedPs = document.createElement('input')
    BasedPs.type = 'text'; BasedPs.placeholder = 'Based Password'
    BasedPs.style.display = 'none';
    

    InputTxtDiv.append(InputSiteApp,InputRange,BasedPs)
    
    //Radio inputs

    var RadioInputs = document.createElement("div")
    RadioInputs.id ='DivRadioInputsBtnGenPass' 

    var BasedPsOpt = document.createElement('input'); BasedPsOpt.type = 'radio';BasedPsOpt.className = 'OptSenhaBs'
    var BasedOsOptSpan = document.createElement("span").appendChild(document.createTextNode('Based password'))

    var NumbersOnlyOpt = document.createElement('input');NumbersOnlyOpt.type = 'radio';NumbersOnlyOpt.className = 'OptNumbersOnly'
    var spanNumeros = document.createElement("span").appendChild(document.createTextNode("Numbers Only"))

    
    RadioInputs.append(BasedPsOpt,BasedOsOptSpan,NumbersOnlyOpt,spanNumeros)


    var GenPsButton = document.createElement("button");GenPsButton.appendChild(document.createTextNode("Generate new password"))    
    
    container.append(InputTxtDiv,RadioInputs,GenPsButton)
    OptsDiv.append(container)


    //Functions

    $(BasedPsOpt).change(function(){
        BasedPs.style.display = 'inline';
        var tes = document.createElement('input');tes.type = 'radio'
        tes.checked = true

        var a = RadioInputs.getElementsByClassName('OptSenhaBs')
        
        RadioInputs.replaceChild(tes,a[0])
        tes.addEventListener('click',function(e){
            var b = RadioInputs.getElementsByTagName('input')
            BasedPsOpt.checked = false
            BasedPs.style.display = 'none';
            RadioInputs.replaceChild(BasedPsOpt,b[0])
        })
    })

    //Uncheck NumbersOnly function

    $(NumbersOnlyOpt).change(function(){
        var tes = document.createElement('input');tes.type = 'radio'
        tes.checked = true
        
        var a = RadioInputs.getElementsByClassName('OptNumbersOnly')

        RadioInputs.replaceChild(tes,a[0])

        tes.addEventListener('click',function(e){
            var b = RadioInputs.getElementsByTagName('input')
            NumbersOnlyOpt.checked = false
            RadioInputs.replaceChild(NumbersOnlyOpt,b[1])
        })})
    
    
    // Request function

    $(GenPsButton).on('click',function(e){
        e.preventDefault()
        if (document.getElementById('request-response')){document.getElementById('request-response').remove()}
        if (InputSiteApp.value != '' &&  InputRange.value >=2 ){
            if (BasedPsOpt.checked == true &&  BasedPs.value == '' ){
                var span = document.createElement("span");
                span.appendChild(document.createTextNode('Based password cannot be empty'))
                span.id = 'request-response'
                container.append(span)
            }
            else{
                $.ajax({
                    type: "POST",
                    url: '/NewPass',
                    contentType: "application/json",
                    data: JSON.stringify({'siteapp':InputSiteApp.value,'senhabsopt':BasedPsOpt.checked,'range':InputRange.value,
                    'numbersonly':NumbersOnlyOpt.checked, 'senhabs':BasedPs.value}),
                    success:function(data,textStatus,xhr){
                        if (xhr.status == 200){
                            if (data['code'] == 1){
                                var span = document.createElement("h3");
                                span.appendChild(document.createTextNode(`Password for ${data['siteapp']}: "${data['password']}"`))
                                span.id = 'request-response'
                                container.append(span)
                            }
                            if (data['code'] == 0){
                                if(data['error']== 1){
                                    var span = document.createElement("h3");
                                    span.appendChild(document.createTextNode('There were a error in server'))
                                    span.id = 'request-response'
                                    container.append(span)
                                }
                                if(data['error']== 2){
                                    var span = document.createElement("h3");
                                    span.appendChild(document.createTextNode(`Password already exists for that site`))
                                    span.id = 'request-response'
                                    container.append(span)
                                }
                            }
                        }
                    }
                })
            }
        }
        else{
            var span = document.createElement("h3");
            span.appendChild(document.createTextNode("Site or App name cannot be empty"))
            span.id = 'request-response'
            container.append(span)
        }
    })
})

// Add new password 

$(BtnAddPass).on('click',function(e){
    RemoveContainer()
    e.preventDefault()

    //Container
    
    var container = document.createElement('div'); container.id = 'Current-container'
    
    // Buttons and Inputs
    var InputSiteName =  document.createElement('input');InputSiteName.type = 'text',InputSiteName.placeholder='Site or app name'

    var PasswordInput = document.createElement('input'); PasswordInput.type = 'text',PasswordInput.placeholder='Password'
    
    var AddButton = document.createElement('button');AddButton.type = 'button'; AddButton.appendChild(document.createTextNode('Add password'))
    
    container.append(InputSiteName,PasswordInput,AddButton)
    OptsDiv.append(container)
    
    // Request function
    $(AddButton).on('click',function(e){
        e.preventDefault()
        if (document.getElementById('request-response')){document.getElementById('request-response').remove()}
        if(InputSiteName.value != ''){
        $.ajax({
            url:"/AddNewPass",
            type: "post",
            contentType: "application/json",
            data: JSON.stringify({'siteapp':InputSiteName.value,'password':PasswordInput.value}),
            success:function(data,textStatus,xhr){
                if(xhr.status == 200){
                    if(data['code']== 1){
                        var span = document.createElement("h3");
                        span.appendChild(document.createTextNode(`Password for ${data['siteapp']} added`))
                        span.id = 'request-response'
                        container.append(span)
                    }
                    if(data['code']==0){
                        if(data['error'] == 2){
                            var span = document.createElement("h3");
                            span.appendChild(document.createTextNode(`Password already exists for that site`))
                            span.id = 'request-response'
                            container.append(span)
                        }
                        if(data['error']==1){
                        var span = document.createElement("h3");
                        span.appendChild(document.createTextNode("There were a error in server"))
                        span.id = 'request-response'
                        container.append(span)
                        }
                    }
                }
            }
        })}
        else{
            var span = document.createElement("h3");
            span.appendChild(document.createTextNode("Site or App name cannot be empty"))
            span.id = 'request-response'
            container.append(span)
        }
        
    })
})

// Get password
    
$(BtnResPass).on('click',function(e){
        RemoveContainer()
        e.preventDefault()
    
        //Container
        var container = document.createElement('div'); container.id = 'Current-container'
    
        // Input site name
        var InputSiteName =  document.createElement('input');InputSiteName.type = 'text',InputSiteName.placeholder='Site or app name'
        
        //Search Button
        var SearchButton = document.createElement('button');SearchButton.type = 'button'
        SearchButton.appendChild(document.createTextNode('Search'))
        
        container.append(InputSiteName,SearchButton)
        OptsDiv.append(container)
    
        $(SearchButton).on('click',function(e){
            e.preventDefault()
            if (document.getElementById('request-response')){document.getElementById('request-response').remove()}
            if(InputSiteName.value != ''){
            $.ajax({
                url:"/GetPass",
                type: "post",
                contentType: "application/json",
                data: JSON.stringify({'siteapp':InputSiteName.value}),
                success:function(data,textStatus,xhr){
                    if (xhr.status == 200){
                        if (data['code'] == 1){
                            var span = document.createElement("h3");
                            span.appendChild(document.createTextNode(`${data['siteapp']} password : "${data['password']}"`))
                            span.id = 'request-response'
                            container.append(span)}
                        if (data['code'] == 0){
                            if (data['error'] == 1 ){
                                var span = document.createElement("h3");
                                span.appendChild(document.createTextNode("There were a error in server"))
                                span.id = 'request-response'
                                container.append(span)}
                            if (data['error'] == 2){
                            var span = document.createElement("span");
                            span.appendChild(document.createTextNode(`Password for "${data['siteapp']}" was not found`))
                            span.id = 'request-response'
                            container.append(span)}}
                    }
                    }
                })
            }
            else{
                var span = document.createElement("h3");
                span.appendChild(document.createTextNode("Site or App name cannot be empty"))
                span.id = 'request-response'
                container.append(span)}   
        })
})

//Change or Delete password Opts

$(BtnChangeOrDelete).on('click', function(e){
    RemoveContainer()
    var container = document.createElement('div'); container.id = 'Current-container'

    var OptChangePassword = document.createElement("button")
    OptChangePassword.appendChild(document.createTextNode("Change Password"))

    var OptDelete = document.createElement("button")
    OptDelete.appendChild(document.createTextNode("Delete Password"))

    container.append(OptChangePassword,OptDelete)
    OptsDiv.append(container)

    $(OptChangePassword).on('click', function(e){
        
        e.preventDefault()
        RemoveContainer()
        
        
        var container = document.createElement('div'); container.id = 'Current-container'
        
        var SiteAppNameInput = document.createElement("input");
        SiteAppNameInput.type = "text";SiteAppNameInput.placeholder = "Site or App name"
        
        var NewPassword = document.createElement("input")
        NewPassword.type = "text";NewPassword.placeholder = "New Password"
        
        var ChangeButton = document.createElement("button")
        ChangeButton.appendChild(document.createTextNode("Change Password"))
        
        container.append(SiteAppNameInput,NewPassword,ChangeButton)
        OptsDiv.append(container)
        
        $(ChangeButton).on('click', function(e){
            e.preventDefault()
            if (document.getElementById('request-response')){document.getElementById('request-response').remove()}
            if (SiteAppNameInput.value != "" && NewPassword.value != ""){
                $.ajax({
                    url:"/ChangePassword",
                    type:"POST",
                    contentType: "application/json",
                    data: JSON.stringify({'siteapp':SiteAppNameInput.value,'password':NewPassword.value}),
                    success(data,textStatus,xhr){
                        if (xhr.status == 200){
                            if (data['code'] == 1){
                                var span = document.createElement("h3");
                                span.appendChild(document.createTextNode(`${data['siteapp']} password successful changed`))
                                span.id = 'request-response'
                                container.append(span)}
                            if (data['code'] == 0){
                                if (data['error'] == 1){
                                    var span = document.createElement("h3");
                                    span.appendChild(document.createTextNode("There were a server error"))
                                    span.id = 'request-response'
                                    container.append(span)}
                                if (data['error'] == 2){
                                    var span = document.createElement("h3");
                                    span.appendChild(document.createTextNode(`App or Site "${data['siteapp']}" was not found`))
                                    span.id = 'request-response'
                                    container.append(span)            
                                }
                            }
                        }    
                  }
                })
            }
            else{
                var span = document.createElement("h3");
                span.appendChild(document.createTextNode("App or Site name cannot be empyt"))
                span.id = 'request-response'
                container.append(span)
            }
        })

    })

    $(OptDelete).on('click', function(e){
        e.preventDefault()
        RemoveContainer()

        var container = document.createElement('div'); container.id = 'Current-container'

        var SiteAppNameInput = document.createElement("input");
        SiteAppNameInput.type = "text";SiteAppNameInput.placeholder = "Site or App name"

        var DeleteButton = document.createElement("button")
        DeleteButton.appendChild(document.createTextNode("Delete Password"))
        
        container.append(SiteAppNameInput,DeleteButton)
        OptsDiv.append(container)

        $(DeleteButton).on('click', function(e){
            e.preventDefault()
            if (document.getElementById('request-response')){document.getElementById('request-response').remove()}
            if (SiteAppNameInput.value != ""){
                $.ajax({
                    url:"/DeletePassword",
                    type:"POST",
                    contentType: "application/json",
                    data: JSON.stringify({'siteapp':SiteAppNameInput.value}),
                    success(data,textStatus,xhr){
                        if (xhr.status == 200){
                            if (data['code'] == 1){
                                var span = document.createElement("h3");
                                span.appendChild(document.createTextNode(`${data['siteapp']} password successful deleted`))
                                span.id = 'request-response'
                                container.append(span)}
                            if (data['code'] == 0){
                                if (data['error'] == 1){
                                    var span = document.createElement("h3");
                                    span.appendChild(document.createTextNode("There were a server error"))
                                    span.id = 'request-response'
                                    container.append(span)}
                                if (data['error'] == 2){
                                    var span = document.createElement("h3");
                                    span.appendChild(document.createTextNode(`App or Site "${data['siteapp']}" was not found`))
                                    span.id = 'request-response'
                                    container.append(span)}}}}})}
            else{
                var span = document.createElement("h3");
                span.appendChild(document.createTextNode("App or Site name cannot be empyt"))
                span.id = 'request-response'
                container.append(span)
            }  
        })
    })
})
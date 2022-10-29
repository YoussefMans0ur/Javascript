$(document).ready(function () {
    let rowData = document.getElementById('rowData');
    let searchInputByName = document.getElementById('searchInputByName');
    let searchInputByLetter = document.getElementById('searchInputByLetter');

    let navSize = $('.navs').outerWidth()
    $('#sideNav').css('left', `-${navSize}`)
    $('#loadingScreen').fadeOut(1000, function() {
        $('#loadingScreen').remove();
        $('body').css('overflow','auto');
    })
    $('.menu-toggel').click(function () {
        if($('#sideNav').css('left')=== '0px')
        {
            $('#sideNav').animate({left: `-${navSize}`} , 500)
            $('#menuBtn').removeClass('fa-times')
            $('#navList li').animate({ opacity: "0", paddingTop: "500px"}, 1000)
        }
        else
        {
            $('#sideNav').animate({left: `0px`} , 500)
            $('#menuBtn').addClass('fa-times')
            $('#navList li').animate({ opacity: "1", paddingTop: "0px"}, 1500)
        }
    })
    function loadingIn() {
        $('#loadingSite').css('display','flex')
    }
    function loadingOut() {
        $('#loadingSite').fadeOut(1000)
    }
    function getTop() {
        $("html, body").animate({scrollTop: 0}, 200)
    }
    
    async function getApi(mealName) {
        apiResponse = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${mealName}`);
        responseData = await apiResponse.json()
        getMeal(responseData);
    }
    getApi('');
    async function getApiByLetter(mealLetter) {
        apiResponse = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${mealLetter}`);
        responseData = await apiResponse.json()
        getMeal(responseData);
    }
    searchInputByName.addEventListener('keyup', function() {
        loadingIn();
        $('#rowData').css('display', 'flex')
        getApi(this.value.toLowerCase())  
    })
    searchInputByLetter.addEventListener('keyup', function(e) {
        loadingIn();
        $('#rowData').css('display', 'flex')
        if(e.code == 'Backspace') {
            loadingIn();
            loadingOut();
        }
        else
        {
            getApiByLetter(this.value.toLowerCase())  
        }
    })
    function getMeal(data) {
        if (data.meals === null) {
            loadingIn();
        }
        else {
            getTop();
            rowData.innerHTML = ``;
            for (let i=0; i<data.meals.length; i++) {
                rowData.innerHTML += `<div class="col-md-3 shadow">
                <div id="mealDetails${i}">
                    <div class="post rounded">
                        <img src="${data.meals[i].strMealThumb}" class="w-100">
                        <div class="layer w-100 h-100">
                            <div class="d-flex h-100 align-items-center">
                                <div class="info p-2">
                                    <h2>${data.meals[i].strMeal}</h2>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`
            }
            loadingOut();
            for (let i=0; i<data.meals.length; i++) {
                $(`#mealDetails${i}`).on('click', function() {
                    getApiMealsDetails(data.meals[i].idMeal)
                })
            }
        }
    }

    $('#navList li a').click(function () {
        $('#sideNav').animate({left: `-${navSize}`} , 500)
        $('#menuBtn').removeClass('fa-times')
        $('#navList li').animate({ opacity: "0", paddingTop: "500px"}, 1000)
    })
    $('#search').click(function() {
        $('#searchContainer').css('display', 'block')
        $('#rowData').css('display', 'none')
    })
    $('#categories').click(async function() {
        await getApiCategories();
        getTop();
        $('#searchContainer').css('display', 'none')
        $('#rowData').css('display', 'flex')
        rowData.innerHTML = ``;
        for (let i=0; i<responseCategories.categories.length; i++) {
            rowData.innerHTML += `<div class="col-md-3 shadow">
                <div id="categoryMeals${i}">
                    <div class="post rounded">
                        <img src="${responseCategories.categories[i].strCategoryThumb}" class="w-100">
                        <div class="layer w-100 h-100">
                            <div class="d-flex h-100 align-items-center">
                                <div class="info p-2">
                                    <h2>${responseCategories.categories[i].strCategory}</h2>
                                    <p>${responseCategories.categories[i].strCategoryDescription.split(' ').splice(0,20).join(' ')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`
        }
        loadingOut()
        for (let i=0; i<responseCategories.categories.length; i++) {
            $(`#categoryMeals${i}`).on('click', function() {
                getApiCategoryMeals(responseCategories.categories[i].strCategory)
            })  
        }
   })

    async function getApiCategories() {
        loadingIn();
        apiCategories = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`);
        responseCategories = await apiCategories.json() 
    }
    async function getApiCategoryMeals(category) {
        loadingIn();
        apiCategory = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
        responseCategory = await apiCategory.json()
        displayMeals(responseCategory.meals); 
    }
    async function getApiAreaMeals(area) {
        loadingIn();
        apiResponse = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`);
        responseData = await apiResponse.json()
        displayMeals(responseData.meals);  
    }
    async function getApiIngredientMeals(ingredient) {
        loadingIn();
        apiResponse = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`);
        responseData = await apiResponse.json();
        displayMeals(responseData.meals); 
    }

    async function getApiFilter(filter) {
        loadingIn();
        api = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?${filter}=list`);
        responseApi = await api.json();
    }
    $('#area').click(async function() {
        await getApiFilter('a');
        getTop();
        $('#searchContainer').css('display', 'none')
        $('#rowData').css('display', 'flex')
        rowData.innerHTML = ``;
        for (let i=0; i<20; i++) {
            rowData.innerHTML += `<div class="col-md-3 shadow">
                <div id="areaMeals${i}">
                    <div class="post rounded">
                        <i class="fa-solid fa-city fa-3x"></i>
                        <h2 class="text-white">${responseApi.meals[i].strArea}</h2>
                    </div>
                </div>
            </div>`
        }
        loadingOut();
        for (let i=0; i<responseApi.meals.length; i++) { 
            $(`#areaMeals${i}`).on('click', function() {
                getApiAreaMeals(responseApi.meals[i].strArea)
            })
        }
    })
    $('#ingredients').click(async function() {
        getTop();
        await getApiFilter('i');
        $('#searchContainer').css('display', 'none')
        $('#rowData').css('display', 'flex')
        rowData.innerHTML = ``;
        for (let i=0; i<20; i++) {
            rowData.innerHTML += `<div class="col-md-3 shadow">
                <div id="ingredientsMeals${i}">
                    <div class="post rounded">
                        <i class="fa-solid fa-bowl-food fa-3x"></i>
                        <h2 class="text-white">${responseApi.meals[i].strIngredient}</h2>
                        <p class="text-white">${responseApi.meals[i].strDescription.split(' ').splice(0,20).join(' ')}</p>
                    </div>
                </div>
            </div>`
        }
        loadingOut();
        for (let i=0; i<20; i++) {
            $(`#ingredientsMeals${i}`).on('click', function() {
                getApiIngredientMeals(responseApi.meals[i].strIngredient)
            })
        }
    })

    async function getApiMealsDetails(mealId) {
        loadingIn();
        apiMealsDetails = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
        responseMealsDetails = await apiMealsDetails.json();
        displayMealDetails(responseMealsDetails.meals[0]);
    }
    function displayMeals(arr) {
        getTop();
        $('#searchContainer').css('display', 'none')
        $('#rowData').css('display', 'flex')
        rowData.innerHTML = ``;
        for (let i=0; i<arr.length; i++) {
            rowData.innerHTML += `<div class="col-md-3 shadow">
                <div id="mealDetails${i}">
                    <div class="post rounded">
                         <img src="${arr[i].strMealThumb}" class="w-100">
                        <div class="layer w-100 h-100">
                               <div class="d-flex h-100 align-items-center">
                                <div class="info p-2">
                                    <h2>${arr[i].strMeal}</h2>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`
        }
        loadingOut()
        for (let i=0; i<arr.length; i++) {
            $(`#mealDetails${i}`).on('click', function() {
                getApiMealsDetails(arr[i].idMeal)
            })
        }
    }
    function displayMealDetails(meal) {
        getTop();
        let mealRecipes = ``;
        for(let i=0; i<20; i++) {
            if(meal[`strIngredient${i+1}`]) 
            {
                mealRecipes += `<li class="recipes-info my-3 mx-1 p-1 rounded list-group">${meal[`strMeasure${i+1}`]} ${meal[`strIngredient${i+1}`]}</li>`; 
            }
        }
        let tags = meal.strTags?.split(',');
        let mealTags = ``;
        for (let i=0; i<tags?.length; i++) {
            mealTags += `<li class="tags-info my-3 mx-1 p-1 rounded list-group">${tags[i]}</li>`
        }
        rowData.innerHTML = `<div class="col-md-4 text-white">
                <img src="${meal.strMealThumb}" class="w-100">
                <h1>${meal.strMeal}</h1>
            </div>
            <div class="col-md-8 text-white text-start">
                <h2>Instructions</h2>
                <p>${meal.strInstructions}</p>
                <p><b>Area :</b> ${meal.strArea}</p>
                <p><b class="fw-bolder">Category :</b> ${meal.strCategory}</p>
                <h3 class="">Recipes :</h3>
                <ul id="mealRecipes" class="d-flex flex-wrap p-0"></ul>
                <h3 class="my-2 mx-1 p-1">Tags :</h3>
                <ul id="mealTags" class="d-flex p-0"></ul>
                <a class="btn btn-success text-white" target="blank" href="${meal.strSource}">Source</a>
                <a class="btn btn-outline-danger youtube text-white" target="blank1" href="${meal.strYoutube}">Youtub</a>
            </div>`
        document.getElementById('mealRecipes').innerHTML = mealRecipes;
        document.getElementById('mealTags').innerHTML = mealTags;
        loadingOut();
    }

    $('#contactUs').click(function() {
        $('#searchContainer').css('display', 'none')
        $('#rowData').css('display', 'flex')
        rowData.innerHTML = `<section id="contact" class="container w-75">
            <div class="row gy-3">
                <h2 class="text-white mb-5">ContacUs...</h2>
                <div class="col-md-6 mb-2">
                    <input id="userName" class="form-control" placeholder="Enter Your Name">
                    <div id="nameAlert" class="alert mt-1 alert-danger">Special Characters and Numbers not allowed</div>
                </div>
                <div class="col-md-6 ">
                    <input id="userEmail" class="form-control" placeholder="Enter Email">
                    <div id="emailAlert" class="alert mt-1 alert-danger">Enter valid email. *Ex: xxx@yyy.zzz</div>
                </div>
                <div class="col-md-6 ">
                    <input id="userPhone" class="form-control" placeholder="Enter Phone">
                    <div id="phoneAlert" class="alert mt-1 alert-danger">Enter valid Phone Number</div>
                 </div>
                <div class="col-md-6 ">
                    <input id="userAge" class="form-control" placeholder="Enter Age">
                    <div id="ageAlert" class="alert mt-1 alert-danger">Enter valid Age</div>
                </div>
                <div class="col-md-6 ">
                    <input id="userPassword" type="password" class="form-control" placeholder="Enter Password">
                    <div id="passwordAlert" class="alert mt-1 alert-danger">Enter valid password *Minimum eight characters, at least one letter and one number:*</div>
                </div>
                <div class="col-md-6 ">
                    <input id="userRePassword" type="password" class="form-control" placeholder="Enter RePassword">
                    <div id="rePasswordAlert" class="alert mt-1 alert-danger">Enter valid Repassword</div>
                </div>
            </div>
            <button id="submitBtn" type="submit" disabled class="btn btn-outline-danger my-3">Submit</button>
        </section>`;

        let userPassword = document.getElementById('userPassword');
        let userRePassword = document.getElementById('userRePassword');
    
        let userPasswordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    
        function validateUserName() {
            let userName = document.getElementById('userName');
            let userNameRegex = /^[a-zA-Z ]+$/;
            return (userNameRegex.test(userName.value))
        }
        function validateUserEmail() {
            let userEmail = document.getElementById('userEmail');
            let userEmailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return (userEmailRegex.test(userEmail.value))
        }
        function validateUserPhone() {
            let userPhone = document.getElementById('userPhone');
            let userPhoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
            return (userPhoneRegex.test(userPhone.value))
        }
        function validateUserAge() {
            let userAge = document.getElementById('userAge');
            let userAgeRegex =  /^[1-9][0-9]?$|^100$/;
            return (userAgeRegex.test(userAge.value))
        }
        function validateUserPassword() {
            return (userPasswordRegex.test(userPassword.value))
        }
        function validateUserRePassword() {
            return (userPassword.value == userRePassword.value)
        }
    
        
        $('#userName').keyup(function() {
            validateUserName();
            if(validateUserName()) {
                $('#userName').removeClass('is-invalid');
                $('#userName').addClass('is-valid');
                $('#nameAlert').css('display','none')
            }
            else {
                $('#userName').removeClass('is-valid');
                $('#userName').addClass('is-invalid');
                $('#nameAlert').css('display','block')
            }
        })
    
        $('#userEmail').keyup(function() {
            validateUserEmail();
            if(validateUserEmail()) {
                $('#userEmail').removeClass('is-invalid');
                $('#userEmail').addClass('is-valid');
                $('#emailAlert').css('display','none')
            }
            else {
                $('#userEmail').removeClass('is-valid');
                $('#userEmail').addClass('is-invalid');
                $('#emailAlert').css('display','block')
            }
        })
    
        $('#userPhone').keyup(function() {
            validateUserPhone();
            if(validateUserPhone()) {
                $('#userPhone').removeClass('is-invalid');
                $('#userPhone').addClass('is-valid');
                $('#phoneAlert').css('display','none')
            }
            else {
                $('#userPhone').removeClass('is-valid');
                $('#userPhone').addClass('is-invalid');
                $('#phoneAlert').css('display','block')
            }
        })
    
        $('#userAge').keyup(function() {
            validateUserAge();
            if(validateUserAge()) {
                $('#userAge').removeClass('is-invalid');
                $('#userAge').addClass('is-valid');
                $('#ageAlert').css('display','none')
            }
            else {
                $('#userAge').removeClass('is-valid');
                $('#userAge').addClass('is-invalid');
                $('#ageAlert').css('display','block')
            }
        })
    
        $('#userPassword').keyup(function() {
            validateUserPassword();
            if(validateUserPassword()) {
                $('#userPassword').removeClass('is-invalid');
                $('#userPassword').addClass('is-valid');
                $('#passwordAlert').css('display','none')
            }
            else {
                $('#userPassword').removeClass('is-valid');
                $('#userPassword').addClass('is-invalid');
                $('#passwordAlert').css('display','block')
            }
        })
    
        $('#userRePassword').keyup(function() {
            validateUserRePassword();
            if(validateUserRePassword()) {
                $('#userRePassword').removeClass('is-invalid');
                $('#userRePassword').addClass('is-valid');
                $('#rePasswordAlert').css('display','none')
            }
            else {
                $('#userRePassword').removeClass('is-valid');
                $('#userRePassword').addClass('is-invalid');
                $('#rePasswordAlert').css('display','block')
            }
        })
    
        $('#contact input').keyup(function() {
    
            if( validateUserName() && validateUserEmail() && validateUserPhone() && validateUserAge() && validateUserPassword() && validateUserRePassword() ) {
                $('#submitBtn').removeAttr('disabled');
            }
            else {
                $('#submitBtn').attr('disabled','ok');
            }
        })
    })


})
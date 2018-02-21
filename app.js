(function () {
   'use strict';
  
   angular
      .module('app', [])
      .controller('AccountController', AccountController)
      .controller('DepositController', DepositController)
      .controller('WithdrawController', WithdrawController);

      AccountController.$inject = ['$scope']; 
      function AccountController($scope) {
         var vm = this;
         vm.accountBalance = 0;
         vm.activate = _activate;

         function _activate()
         {
            $scope.$on("AmountDeposited", _amountDepositedHandler);
            $scope.$on("AmountWithdrawn", _amountWithdrawnHandler);
         }

         function _amountDepositedHandler(event, args)
         {            
            vm.accountBalance += eval(args.amount);
         }
 
         function _amountWithdrawnHandler(event, args)         
         {
            if(vm.accountBalance - eval(args.amount) < 0)
            {
               $scope.$broadcast("WithdrawalNotAllowed", { balance: vm.accountBalance });
            }
            else 
            {
               vm.accountBalance -= eval(args.amount);
            }
         }

         _activate();
      }

      DepositController.$inject = ['$scope'];
      function DepositController($scope) {
         var vm = this;
         vm.amount = 0;
         vm.deposit = _deposit;

         function _deposit()
         {
            $scope.$emit("AmountDeposited", {amount: vm.amount});
            vm.amount = 0;
         }
      }

      WithdrawController.$inject = ['$scope'];
      function WithdrawController($scope) {
         var vm = this; 
         vm.amount = 0;
         vm.validationError = "";
         vm.activate = _activate;
         vm.withdraw = _withdraw;

         function _activate()
         {
            $scope.$on("WithdrawalNotAllowed", _withdrawalNotAllowedHandler);
         }

         function _withdraw()
         {
            vm.validationError = "";
            $scope.$emit("AmountWithdrawn", {amount: vm.amount});
            vm.amount = 0;
        }
        function _withdrawalNotAllowedHandler(event, args)
        {
           vm.validationError = "You cannot withdraw more than $" + args.balance;
        }
       _activate();
   }

})();
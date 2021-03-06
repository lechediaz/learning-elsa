using System.Collections.Generic;
using System.Threading.Tasks;
using FactoryApp.Dtos;
using FactoryApp.Enums;
using FactoryApp.Services.Base;
using FactoryApp.Services.Requests;
using Microsoft.AspNetCore.Mvc;

namespace FactoryApp.Controllers
{
    [ApiController]
    [Route("api/request")]
    public class RequestController : ControllerBase
    {
        private readonly IApproveRequestService approveRequestService;
        private readonly ICompleteRequestService completeRequestService;
        private readonly ICreateRequestService createRequestService;
        private readonly IDeleteRequestService deleteRequestService;
        private readonly IDispatchRequestService dispatchRequestService;
        private readonly IEditRequestService editRequestService;
        private readonly IGetAllUserRequestsService getAllUserRequestsService;
        private readonly INegotiateRequestService negotiateRequestService;
        private readonly IRequestsToCompleteService requestsToCompleteService;
        private readonly IViewRequestByIdService viewRequestByIdService;
        private readonly IPublishRequestService publishRequestService;
        private readonly IRejectRequestService rejectRequestService;

        public RequestController(
            IApproveRequestService approveRequestService,
            ICompleteRequestService completeRequestService,
            ICreateRequestService createRequestService,
            IDeleteRequestService deleteRequestService,
            IDispatchRequestService dispatchRequestService,
            IEditRequestService editRequestService,
            IGetAllUserRequestsService getAllUserRequestsService,
            INegotiateRequestService negotiateRequestService,
            IViewRequestByIdService viewRequestByIdService,
            IPublishRequestService publishRequestService,
            IRejectRequestService rejectRequestService,
            IRequestsToCompleteService requestsToCompleteService)
        {
            this.approveRequestService = approveRequestService;
            this.completeRequestService = completeRequestService;
            this.createRequestService = createRequestService;
            this.deleteRequestService = deleteRequestService;
            this.dispatchRequestService = dispatchRequestService;
            this.editRequestService = editRequestService;
            this.getAllUserRequestsService = getAllUserRequestsService;
            this.negotiateRequestService = negotiateRequestService;
            this.requestsToCompleteService = requestsToCompleteService;
            this.viewRequestByIdService = viewRequestByIdService;
            this.publishRequestService = publishRequestService;
            this.rejectRequestService = rejectRequestService;
        }

        [HttpGet("to-complete")]
        public async Task<ActionResult<IEnumerable<RequestPendingDto>>> GetPending()
        {
            ServiceResult<IEnumerable<RequestPendingDto>> result = await requestsToCompleteService.GetAsync();

            if (result.Ok)
            {
                return Ok(result.Extras);
            }

            return Problem(result.Message);
        }

        [HttpGet("from-user/{userId:int}")]
        public async Task<ActionResult<IEnumerable<UserRequestDto>>> GetAllFromUser(
            [FromRoute] int userId,
            [FromQuery] RequestStatus? status = null)
        {
            ServiceResult<IEnumerable<UserRequestDto>> result = await getAllUserRequestsService.GetAsync(userId, status);

            if (result.Ok)
            {
                return Ok(result.Extras);
            }

            return Problem(result.Message);
        }

        [HttpGet("{requestId:int}")]
        public async Task<ActionResult<ViewRequestDto>> GetById([FromRoute] int requestId)
        {
            ServiceResult<ViewRequestDto> result = await viewRequestByIdService.GetAsync(requestId);

            if (result.Ok)
            {
                return Ok(result.Extras);
            }

            return Problem(result.Message);
        }

        [HttpPost("create")]
        public async Task<ActionResult<int>> Create(CreateRequestDto requestCreation)
        {
            ServiceResult<int> result = await createRequestService.CreateAsync(requestCreation);

            if (result.Ok)
            {
                return Ok(result.Extras);
            }

            return Problem(result.Message);
        }

        [HttpPut("edit")]
        public async Task<ActionResult> Edit(EditRequestDto requestEdition)
        {
            ServiceResult result = await editRequestService.EditAsync(requestEdition);

            if (result.Ok)
            {
                return Ok();
            }

            return Problem(result.Message);
        }

        [HttpDelete("delete/{requestId:int}")]
        public async Task<ActionResult> Edit([FromRoute] int requestId)
        {
            ServiceResult result = await deleteRequestService.DeleteAsync(requestId);

            if (result.Ok)
            {
                return Ok();
            }

            return Problem(result.Message);
        }

        [HttpPost("publish")]
        public async Task<ActionResult> Publish(PublishRequestDto info)
        {
            ServiceResult result = await publishRequestService.PublishAsync(info);

            if (result.Ok)
            {
                return Ok();
            }

            return Problem(result.Message);
        }

        [HttpPost("approve/{requestId:int}")]
        public async Task<ActionResult> Approve([FromRoute] int requestId)
        {
            ServiceResult result = await approveRequestService.ApproveAsync(requestId);

            if (result.Ok)
            {
                return Ok();
            }

            return Problem(result.Message);
        }

        [HttpPost("reject/{requestId:int}")]
        public async Task<ActionResult> Reject([FromRoute] int requestId)
        {
            ServiceResult result = await rejectRequestService.RejectAsync(requestId);

            if (result.Ok)
            {
                return Ok();
            }

            return Problem(result.Message);
        }

        [HttpPost("negotiate/{requestId:int}")]
        public async Task<ActionResult> Negotiate([FromRoute] int requestId)
        {
            ServiceResult result = await negotiateRequestService.NegotiateAsync(requestId);

            if (result.Ok)
            {
                return Ok();
            }

            return Problem(result.Message);
        }

        [HttpPost("dispatch/{requestId:int}")]
        public async Task<ActionResult> Dispatch([FromRoute] int requestId)
        {
            ServiceResult result = await dispatchRequestService.DispatchAsync(requestId);

            if (result.Ok)
            {
                return Ok();
            }

            return Problem(result.Message);
        }

        [HttpPost("complete/{requestId:int}")]
        public async Task<ActionResult> Complete([FromRoute] int requestId)
        {
            ServiceResult result = await completeRequestService.CompleteAsync(requestId);

            if (result.Ok)
            {
                return Ok();
            }

            return Problem(result.Message);
        }
    }
}
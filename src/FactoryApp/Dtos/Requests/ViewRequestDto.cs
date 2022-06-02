using System;
using System.Collections.Generic;
using FactoryApp.Enums;

namespace FactoryApp.Dtos
{
    public class ViewRequestDto
    {
        public int Id { get; set; }
        public RequestStatus Status { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? ApprovedAt { get; set; }
        public DateTime? RejectedAt { get; set; }
        public virtual UserInViewRequestDto CreatedBy { get; set; }
        public virtual UserInViewRequestDto Receiver { get; set; }
        public virtual IEnumerable<DetailInViewRequestDto> Details { get; set; }
    }

    public class UserInViewRequestDto
    {
        public string Name { get; set; }
        public string Email { get; set; }
    }

    public class DetailInViewRequestDto
    {
        public string Name { get; set; }
        public double Quantity { get; set; }
    }
}